import { CryptoType, CurrencyService } from '../service/CurrencyService';
import { EtherService } from '../service/EtherService';
import { MutableConfigRepository } from '../infrastructure/MutableConfigRepository';
import { UserRepository } from '../infrastructure/UserRepository';
import { CryptoTransaction } from '../model/CryptoTransaction';
import { weiToEther } from '../util/CurrencyUtil';
import { TransactionRepository } from '../infrastructure/TransactionRepository';
import { UserTransaction } from '../model/UserTransaction';
import { MyobService } from '../service/MyobService';
import { MyobLedgerRepository } from '../infrastructure/MyobLedgerRepository';
import { MyobTransactionRepository } from '../infrastructure/MyobTransactionRepository';

/**
 * Processes payments we find on the blockchain that match the addresses we are searching for.
 */
async function processPaymentsReceived(currencyService: CurrencyService,
                                       etherService: EtherService,
                                       myobService: MyobService,
                                       userRepo: UserRepository,
                                       mutableConfigRepo: MutableConfigRepository,
                                       transactionRepo: TransactionRepository): Promise<CryptoTransaction[]> {
  const allTransactions: CryptoTransaction[] = [];

  // TODO: Remove "1 ??" before final deployment
  const lastBlockRead = 1 ?? await mutableConfigRepo.getLastBlockRead();
  const currentBlock = await etherService.getCurrentBlockNumber();

  const users = await userRepo.list();

  for (const user of users) {
    const addressesToMonitor = user.wallets.flatMap((wallet) => wallet.address);

    for (const address of addressesToMonitor) {
      const queryResp: object[] = await etherService.queryTransactionsReceivedAtAddress(address, lastBlockRead, currentBlock);

      // List of crypto transactions made during the last block read time and now for the current address
      const transactions: CryptoTransaction[] = await Promise.all(queryResp.map(async (raw) => {
        // Timestamp given is in seconds, whereas date uses milliseconds
        const dateOfTransaction = new Date(raw['timestamp'] * 1000);

        const exchangeRate = await currencyService.cryptoToNzd(CryptoType.ETHER, dateOfTransaction);

        const amountEther = weiToEther(raw['value']);
        const feeEther = weiToEther(raw['gasPrice']);
        const amountNzd = exchangeRate * amountEther;
        const feeNzd = exchangeRate * feeEther;

        return {
          addressFrom: raw['from'],
          addressTo: raw['to'],
          amountEther,
          feeEther,
          amountNzd,
          feeNzd,
          timestamp: dateOfTransaction.valueOf(),
        };
      }));

      // Add all current transactions for this address to all transactions, to be returned
      allTransactions.push.apply(allTransactions, transactions);

      const tokens = await myobService.refreshAccessToken(user.myobRefreshToken);
      user.myobRefreshToken = tokens.refresh_token;
      await userRepo.save(user);

      const userCfUri = await myobService.getCFUriFromCFId(user.companyFileMyobId);
      const myobLedgerRepo = new MyobTransactionRepository(myobService, userCfUri, user.kacheAssetAccountMyobId);

      for (const transaction of transactions) {
        await myobLedgerRepo.addTransaction(transaction);
      }
    }
  }

  await saveTransactionsToDb(transactionRepo, userRepo, allTransactions);

  // Update the last read block on the config DB to match
  await mutableConfigRepo.setLatestBlockRead(currentBlock);

  return allTransactions;
}

/**
 * Saves a list of `transactions` to the DB.
 */
async function saveTransactionsToDb(transactionRepo: TransactionRepository,
                                    userRepo: UserRepository,
                                    transactions: CryptoTransaction[]) {
  const address = transactions[0]?.addressTo;

  if (address) {
    const user = await userRepo.getUserByAddress(address);

    if (!user) throw Error('Cannot link transaction with user!');

    for (const transaction of transactions) {
      const newUserTransaction: UserTransaction = {
        user: user,
        cryptoTransaction: transaction,
      };

      await transactionRepo.save(newUserTransaction);
    }
  }
}

export {
  processPaymentsReceived,
};
