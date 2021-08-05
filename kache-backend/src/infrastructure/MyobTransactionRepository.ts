import { CryptoTransaction } from '../model/CryptoTransaction';
import { MyobService } from '../service/MyobService';
import { MyobLedgerRepository } from './MyobLedgerRepository';
import { precisionRound } from '../util/NumberUtil';

const RECEIVE_TRANSACTION_URI = '/Banking/ReceiveMoneyTxn';

class MyobTransactionRepository {

  private readonly myobService: MyobService;
  private readonly cfUri: string;
  private readonly spendingAccountMyobId: string;

  constructor(myobService: MyobService, cfUri: string, spendingAccountMyobId: string) {
    this.myobService = myobService;
    this.cfUri = cfUri;
    this.spendingAccountMyobId = spendingAccountMyobId;
  }

  async addTransaction(transaction: CryptoTransaction) {
    // This gets the NT tax code (for no tax) - applies for all bank account assets as tax is applied at income account
    const noTaxTaxCodeUid = await this.myobService.getTaxCodeUid(this.cfUri);

    const transactionBody = {
      DepositTo: 'Account',
      Account: {
        UID: this.spendingAccountMyobId,
      },
      Memo: `Wallet Import: ${transaction.addressTo}\n\nProcessed by Kache: ${new Date().toDateString()}`,
      Date: new Date(transaction.timestamp).toISOString(),
      Lines: [
        {
          Account: { UID: this.spendingAccountMyobId },
          Amount: precisionRound(transaction.amountNzd - transaction.feeNzd, 2),
          UnitCount: 1,
          Memo: `Received from: ${transaction.addressFrom}\n\nGas Fee: $${precisionRound(transaction.feeNzd, 2)} NZD deducted\n($ETH value ${precisionRound(transaction.amountEther, 4)}, gas fee ${precisionRound(transaction.feeEther, 4)})`,
          TaxCode: {
            Uid: noTaxTaxCodeUid,
          },
        },
      ],
    };

    const addTransactionResp = await this.myobService.makeCFApiCall(`${this.cfUri}${RECEIVE_TRANSACTION_URI}`,
                                                                    'POST',
                                                                    null,
                                                                    transactionBody);

    if (!addTransactionResp.ok) {
      throw new Error(`Failed to add transaction: ${addTransactionResp.body.read()}`);
    }
  }

}

export {
  MyobTransactionRepository,
};
