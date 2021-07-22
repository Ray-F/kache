import { BlockTag, EtherscanProvider, JsonRpcProvider } from '@ethersproject/providers';
import { ethers, utils } from 'ethers';
import { logger } from '../util/Logger';

const MAINNET_NETWORK = "mainnet";
const TEST_NETWORK = "ropsten";

class EtherService {
  private provider: JsonRpcProvider;
  private scanProvider: EtherscanProvider;

  constructor(nodeUrl: string, etherScanApiKey: string) {
    this.provider = new ethers.providers.JsonRpcProvider(nodeUrl);
    this.scanProvider = new ethers.providers.EtherscanProvider(TEST_NETWORK, etherScanApiKey);

    this.provider.getBlockNumber().then((result) => {
      logger.logInfo(`Connected to Ethereum Node: ${result}`)
    })
  }

  /**
   * Returns the bank balance of the address, with amount in ethers.
   */
  public async queryAddressBalance(address: string) {
    const balResp = await this.provider.getBalance(address);
    return utils.formatEther(balResp);
  }

  /**
   * Returns the current block number.
   *
   * This block number can be used as a "block" timestamp.
   */
  public async getCurrentBlockNumber() {
    return await this.provider.getBlockNumber();
  }

  /**
   * Get all transactions originating from an `address` since `fromBlock` to `toBlock` (inclusive).
   */
  public async queryTransactionsReceivedAtAddress(address: string, fromBlock?: BlockTag, toBlock?: BlockTag) {
    return await this.scanProvider.getHistory(address, fromBlock, toBlock);
  }

}

export {
  EtherService
}
