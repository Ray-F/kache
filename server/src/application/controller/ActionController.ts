import { Request, Response } from 'express';
import { MongoAdapter } from '../../infrastructure/MongoAdapter';
import { MutableConfigRepository } from '../../infrastructure/MutableConfigRepository';
import { UserRepository } from '../../infrastructure/UserRepository';
import { processPaymentsReceived } from '../../usecase/QueryPaymentsReceived';
import { CurrencyService } from '../../service/CurrencyService';
import Config from '../../util/Config';
import { EtherService } from '../../service/EtherService';

class ActionController {

  public async runPaymentCheck(req: Request, res: Response) {
    const mongoAdapter = MongoAdapter.getInstance()
    const mutableConfigRepo = new MutableConfigRepository(mongoAdapter);
    const userRepo = new UserRepository(mongoAdapter);

    const currencyService = new CurrencyService(Config.COINLAYER_ACCESS_KEY);
    const etherService = new EtherService(Config.ETH_NODE_URL, Config.ETHERSCAN_API_KEY);

    await processPaymentsReceived(currencyService, etherService, userRepo, mutableConfigRepo);

    res.sendStatus(200);
  }
}

export {
  ActionController
}
