import { BaseController, createJson } from './BaseController';
import { Request, Response } from 'express';
import { CryptoType, CurrencyService } from '../../service/CurrencyService';
import Config from '../../util/Config';
import { precisionRound } from '../../util/NumberUtil';

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

}

export {
  ClientController
}
