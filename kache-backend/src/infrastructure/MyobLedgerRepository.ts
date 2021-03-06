import { MyobService } from '../service/MyobService';
import { logger } from '../util/Logger';
import { CryptoTransaction } from '../model/CryptoTransaction';

const ACCOUNT_URI = '/GeneralLedger/Account';
const TRANSACTION_URI = '/GeneralLedger/Transaction';
const TAXCODE_URI = '/GeneralLedger/TaxCode';

class MyobLedgerRepository {

  private myobService: MyobService;
  private readonly cfUri: string;

  constructor(myobService: MyobService, cfUri: string) {
    this.myobService = myobService;
    this.cfUri = cfUri;
  }

  /**
   * Creates a Crypto Account and returns its MYOB UID.
   */
  async createCryptoAccount(): Promise<string> {
    // Check if a crypto account created by us already exists
    const existingCryptoAccountUid = await this.getAccountUidByDisplayId("1-1171");
    if (existingCryptoAccountUid) {
      logger.logInfo("A kache-generated Cryptoasset account already exists, returning UID of that account.")
      return existingCryptoAccountUid;
    }

    // This gets the display ID of Asset account
    const assetAccountUid = await this.getAccountUidByDisplayId('1-0000');

    // This gets the NT tax code (for no tax) - applies for all bank account assets as tax is applied at income account
    const noTaxTaxCodeUid = await this.getTaxCodeUid();

    const createAccountResp = await this.myobService.makeCFApiCall(`${this.cfUri}${ACCOUNT_URI}`,
                                                                   'POST',
                                                                   null,
                                                                   {
                                                                     Name: 'Crypto Wallet (Kache Generated)',
                                                                     DisplayId: '1-1171',
                                                                     Classification: 'Asset',
                                                                     Type: 'Bank',
                                                                     Description: 'All crypto asset payments from Kache (across all defined accounts) will appear here to be reconciled with income accounts',

                                                                     TaxCode: {
                                                                       UID: noTaxTaxCodeUid,
                                                                     },

                                                                     ParentAccount: {
                                                                       UID: assetAccountUid,
                                                                     },

                                                                     IsActive: true,
                                                                     OpeningBalance: 0,
                                                                   });

    if (!createAccountResp.ok) {
      throw new Error(`Failed to create asset account: ${createAccountResp.body.read()}`);
    }

    return await this.getAccountUidByDisplayId('1-1171');
  }

  public async getTaxCodeUid(): Promise<string> {
    const taxCodeResp = await this.myobService.makeCFApiCall(`${this.cfUri}${TAXCODE_URI}`, 'GET');

    const taxCodeObject = (await taxCodeResp.json())['Items'].find((taxCode) => taxCode['Code'] === 'N-T');

    return taxCodeObject['UID'];
  }

  private async getAccountUidByDisplayId(accountDisplayId: string): Promise<string> {
    const assetResp = await this.myobService.makeCFApiCall(`${this.cfUri}${ACCOUNT_URI}`, 'GET');

    const assetAccounts = (await assetResp.json())['Items'];
    const foundAssetAccount = assetAccounts.find((acc) => acc['DisplayID'] === accountDisplayId)
    return foundAssetAccount ? foundAssetAccount['UID'] : null;
  }

}

export {
  MyobLedgerRepository,
};
