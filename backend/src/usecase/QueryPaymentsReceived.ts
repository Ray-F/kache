import { CryptoType, CurrencyService } from '../service/CurrencyService';
import { EtherService } from '../service/EtherService';
import { MutableConfigRepository } from '../infrastructure/MutableConfigRepository';
import { UserRepository } from '../infrastructure/UserRepository';
import { CryptoTransaction } from '../model/CryptoTransaction';
import { weiToEther } from '../util/CurrencyUtil';

/**
 * Processes payments we find on the blockchain that match the addresses we are searching for.
 */
async function processPaymentsReceived(currencyService: CurrencyService,
                                       etherService: EtherService,
                                       userRepo: UserRepository,
                                       mutableConfigRepo: MutableConfigRepository): Promise<CryptoTransaction[]> {
  // TODO: Remove 1 before final deployment
  const lastBlockRead = 1 ?? await mutableConfigRepo.getLastBlockRead();

  const currentBlock = await etherService.getCurrentBlockNumber();

  const addressesToMonitor = await userRepo.listEthereumAddressesToMonitor();

  const allTransactions: CryptoTransaction[] = [];

  for (const address of addressesToMonitor) {
    const queryResp: object[] = await etherService.queryTransactionsReceivedAtAddress(address, lastBlockRead, currentBlock);

    // List of crypto transactions made during the last block read time and now for the current address
    const transactions: CryptoTransaction[] = await Promise.all(queryResp.map(async (raw) => {
      // Timestamp given is in seconds, whereas date uses milliseconds
      const dateOfTransaction = new Date(raw["timestamp"] * 1000);

      const exchangeRate = await currencyService.cryptoToNzd(CryptoType.ETHER, dateOfTransaction);

      const amountNzd = exchangeRate * weiToEther(raw["value"]);
      const feeNzd = exchangeRate * weiToEther(raw["gasPrice"]);

      return {
        addressFrom: raw["from"],
        addressTo: raw["to"],
        amountNzd: amountNzd,
        feeNzd: feeNzd,
        timestamp: dateOfTransaction.valueOf(),
      }
    }));

    // Add all current transactions for this address to all transactions, to be returned
    allTransactions.push.apply(allTransactions, transactions);

    // TODO: Do something with these "bank" transactions by adding them to the MYOB dashboard
    console.log(transactions);
  }

  // Update the last read block on the config DB to match
  await mutableConfigRepo.setLatestBlockRead(currentBlock);

  return allTransactions;
}

export {
  processPaymentsReceived
}
