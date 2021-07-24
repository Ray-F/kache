import { Request, Response } from 'express';
import { MongoAdapter } from '../../infrastructure/MongoAdapter';
import { MutableConfigRepository } from '../../infrastructure/MutableConfigRepository';
import { UserRepository } from '../../infrastructure/UserRepository';
import { processPaymentsReceived } from '../../usecase/QueryPaymentsReceived';
import { CurrencyService } from '../../service/CurrencyService';
import Config from '../../util/Config';
import { EtherService } from '../../service/EtherService';
import { BaseController, createJson } from './BaseController';
import { TransactionRepository } from '../../infrastructure/TransactionRepository';

class AutomationController extends BaseController {

  public async runPaymentCheck(req: Request, res: Response) {
    const mongoAdapter = MongoAdapter.getInstance();
    const etherService = new EtherService(Config.ETH_NODE_URL, Config.ETHERSCAN_API_KEY);

    // Ensure mongoAdapter is connected before we proceed
    await mongoAdapter.isConnected();

    const mutableConfigRepo = new MutableConfigRepository(mongoAdapter);
    const userRepo = new UserRepository(mongoAdapter);
    const transactionRepo = new TransactionRepository(mongoAdapter);

    const currencyService = new CurrencyService(Config.COINLAYER_ACCESS_KEY);

    const transactionsProcessed = await processPaymentsReceived(currencyService, etherService, userRepo, mutableConfigRepo, transactionRepo);

    createJson(res,
               200,
               `Successfully processed ${transactionsProcessed.length} transactions`,
               transactionsProcessed);
  }

}

export {
  AutomationController,
};