import { CryptoTransaction } from './CryptoTransaction';
import { User } from './User';

interface UserTransaction {
  id?: string,
  user: User;
  cryptoTransaction: CryptoTransaction;
}

export {
  UserTransaction,
};
