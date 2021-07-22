import { MongoAdapter } from './MongoAdapter';
import { Collection } from 'mongodb';
import Config from '../util/Config';

interface Wallet {
  type: string,
  address: string,
}

interface User {
  id: string,
  name: string,
  wallets: Wallet[]
}

class UserRepository {
  private userCollection: Collection;

  constructor(mongoAdapter: MongoAdapter) {
    this.userCollection = mongoAdapter.db.collection('users');
  }

  public async list(): Promise<User[]> {
    // TODO: Replace this with a proper user
    return [{
      id: "abc",
      name: "Mock User",
      wallets: [
        {
          type: "ETHEREUM",
          address: Config.DEFAULT_WALLET_ADDRESS,
        }
      ]
    }]
    // const dboList = await this.userCollection.find({}).toArray();
    //
    // return dboList.map((dbo) => ({
    //   id: dbo["_id"],
    //   name: dbo["name"],
    //   wallets: dbo["wallets"],
    // }));
  }

  /**
   * Returns a list of Ethereum addresses that require monitoring (i.e. transaction tracking).
   */
  public async listEthereumAddressesToMonitor(): Promise<string[]> {
    // TODO: Do some filtering logic to filter for users with an ethereum wallet and map addresses

    return [Config.DEFAULT_WALLET_ADDRESS]
  }

}

export {
  User,
  Wallet,
  UserRepository,
}
