import fetch from 'node-fetch';
import { padNumber } from '../util/NumberUtil';

enum CryptoType {
  ETHER,
  BITCOIN,
  CARDANO,
}


const ENDPOINT_URL = 'http://api.coinlayer.com';


class CurrencyService {

  private readonly keyQuery: string

  constructor(accessKey: string) {
    this.keyQuery = `?access_key=${accessKey}`
  }

  /**
   * Returns the exchange rate of 1 ETH to NZD of a `cryptoType` at an optional `date` (defaults to live exchange rate).
   */
  async cryptoToNzd(cryptoType: CryptoType, date: Date = null) {
    if (cryptoType !== CryptoType.ETHER) {
      throw new Error("Not implemented yet")
    }

    return date ? await this.getHistoricExchangeRate(date) : await this.getLiveExchangeRate();
  }

  /**
   * Returns the NZD value of 1 ETH on a given date.
   */
  private async getHistoricExchangeRate(date: Date) {
    const year = date.getFullYear();
    const month = padNumber(date.getMonth() + 1, 2, '0');
    const day = padNumber(date.getDate(), 2, '0');

    const resp = await fetch(`${ENDPOINT_URL}/${year}-${month}-${day}${this.keyQuery}&target=NZD&symbols=ETH`);

    const data = await resp.json();
    return data.rates.ETH;
  }

  /**
   * Returns the current NZD value of 1 ETH.
   */
  private async getLiveExchangeRate() {
    const resp = await fetch(`${ENDPOINT_URL}/live${this.keyQuery}&target=NZD&symbols=ETH`);

    const data = await resp.json();
    return data.rates.ETH;
  }

}

export {
  CryptoType,
  CurrencyService
}
