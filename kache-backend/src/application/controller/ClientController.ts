import { BaseController, createJson } from './BaseController';
import { Request, Response } from 'express';
import { CryptoType, CurrencyService } from '../../service/CurrencyService';
import Config from '../../util/Config';
import { precisionRound } from '../../util/NumberUtil';
import { MyobService } from '../../service/MyobService';
import { MongoAdapter } from '../../infrastructure/MongoAdapter';
import { UserRepository } from '../../infrastructure/UserRepository';
import { User } from '../../model/User';
import { onboardNewUser } from '../../usecase/UserOnboarding';
import { MyobLedgerRepository } from '../../infrastructure/MyobLedgerRepository';

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

  /**
   * Run when MYOB requires a callback to generate authentication and access tokens.
   */
  public async myobCodeCallback(req: Request, res: Response) {
    const accessCode = String(req.query.code);
    const myobService = new MyobService(Config.MYOB_PUBLIC_KEY, Config.MYOB_PRIVATE_KEY);

    const mongoAdapter = MongoAdapter.getInstance();
    await mongoAdapter.isConnected();

    const token = await myobService.generateTokens(accessCode);

    // Save the MYOB refresh token to the user for future code execution
    const userRepo = new UserRepository(mongoAdapter);
    const user = await userRepo.getUserByMyobId(token.user.uid);

    // If user by this MYOB account exists, save the refresh token to it. Otherwise, create a new user
    if (user) {
      user.myobRefreshToken = token.refresh_token;
      await userRepo.save(user);
    }

    const newUser: User = {
      name: token.user.username,
      email: token.user.username,
      wallets: [],

      myobId: token.user.uid,
      myobRefreshToken: token.refresh_token,
    }

    await userRepo.save(user);

    const cfUri = await myobService.getCFUriFromId('ec8619d9-bb20-4aae-9bbf-1e0e508bb58a');
    const myobCrmRepo =
    const myobLedgerRepo = new MyobLedgerRepository(myobService, cfUri)
    await onboardNewUser(userRepo, myobLedgerRepo, user);

    res.sendStatus(200);
  }

}

export {
  ClientController
}
