import { BaseController, createJson } from './BaseController';
import { Request, Response } from 'express';
import { CryptoType, CurrencyService } from '../../service/CurrencyService';
import Config from '../../util/Config';
import { precisionRound } from '../../util/NumberUtil';
import { MyobService } from '../../service/MyobService';
import { MongoAdapter } from '../../infrastructure/MongoAdapter';
import { UserRepository } from '../../infrastructure/UserRepository';
import { onboardNewUser } from '../../usecase/UserOnboarding';
import { MyobLedgerRepository } from '../../infrastructure/MyobLedgerRepository';
import { logger } from '../../util/Logger';
import { User } from '../../model/User';

class ClientController extends BaseController {

  public async getCurrentExchange(req: Request, res: Response) {
    const amountNzd = req.query['amountNzd'] ? parseFloat(req.query['amountNzd'].toString()) : undefined;

    const currencyService = new CurrencyService(Config.COINLAYER_ACCESS_KEY);
    const exchangeRate = await currencyService.cryptoToNzd(CryptoType.ETHER);

    const payload = {
      exchangeRate: precisionRound(exchangeRate, 5),
      ...(amountNzd && { amountNzd: precisionRound(amountNzd, 2) }),
      ...(amountNzd && { amountCrypto: precisionRound(amountNzd / exchangeRate, 5) }),
    };

    createJson(res, 200, null, payload);
  }

  public async createNewUnlinkedUser(req: Request, res: Response) {
    if (req.method !== 'POST') {
      res.sendStatus(400);
      return;
    }

    const name = req.body.name;
    const email = req.body.email;
    const wallets = req.body.wallets;

    const user: User = {
      name,
      email,
      wallets,
    };

    const mongoAdapter = MongoAdapter.getInstance();
    await mongoAdapter.isConnected();
    const myobService = new MyobService(Config.MYOB_PUBLIC_KEY, Config.MYOB_PRIVATE_KEY);

    const userRepo = new UserRepository(mongoAdapter);
    const newUser = await userRepo.save(user);

    createJson(res, 201, `Successfully created new user: ${user.name} – ${user.email}`, {
      myobOAuthRedirect: myobService.generateOAuthLink(newUser.id),
    });
  }

  /**
   * Run when MYOB requires a callback to generate authentication and access tokens.
   */
  public async linkUserOnMyob(req: Request, res: Response) {
    const accessCode = String(req.query.code);
    const userId = String(req.query.state);

    const myobService = new MyobService(Config.MYOB_PUBLIC_KEY, Config.MYOB_PRIVATE_KEY);
    const token = await myobService.generateTokens(accessCode);

    const mongoAdapter = MongoAdapter.getInstance();
    await mongoAdapter.isConnected();

    const userRepo = new UserRepository(mongoAdapter);

    let user = await userRepo.getUserById(userId);

    if (!user) {
      createJson(res, 500, "Could not link MYOB user as the old user account could not be found");
    }

    user.myobId = token.user.uid;
    user.myobRefreshToken = token.refresh_token;

    await userRepo.save(user);

    logger.logInfo(`Onboarding new user "${user.name} - ${user.email}:"`);

    // If this is set, this means the user has already been onboarded
    if (user.kacheAssetAccountMyobId) {
      logger.logInfo(`Skipping user "${user.name} - ${user.email}" as they already have a linked asset account`);
      return;
    }

    // If user is not set, then onboard the user
    // TODO: Change to get CompanyFile from user first.
    const cfUri = await myobService.getCFUriFromCFId('ec8619d9-bb20-4aae-9bbf-1e0e508bb58a');
    const myobLedgerRepo = new MyobLedgerRepository(myobService, cfUri);
    await onboardNewUser(userRepo, myobLedgerRepo, user);

    logger.logInfo(`Finished onboarding new user "${user.name} - ${user.email}"!`)

    // Return response to client once entire process is complete
    res.sendStatus(200);
  }

}

export {
  ClientController,
};
