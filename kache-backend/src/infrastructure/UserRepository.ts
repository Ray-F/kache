import { MongoAdapter } from './MongoAdapter';
import { Collection, ObjectId } from 'mongodb';
import Config from '../util/Config';
import { User } from '../model/User';

class UserRepository {
  private userCollection: Collection;

  constructor(mongoAdapter: MongoAdapter) {
    this.userCollection = mongoAdapter.db.collection('users');
  }

  /**
   * Returns a list of all Users.
   */
  public async list(): Promise<User[]> {
    const dboList = await this.userCollection.find({}).toArray();

    return dboList.map((dbo) => mapDboToUser(dbo));
  }

  /**
   * Returns the `User` associated with a crypto `walletAddress` or `null` if none were found.
   */
  public async getUserByAddress(walletAddress: string): Promise<User> {
    const dbo = await this.userCollection.findOne({ 'wallets.address': walletAddress });

    return dbo ? mapDboToUser(dbo) : null;
  }

  /**
   * Returns the `User` associated with an `myobId` or `null` if none were found.
   */
  public async getUserByMyobId(myobId: string): Promise<User> {
    const dbo = await this.userCollection.findOne({ 'myobId': myobId });

    return dbo ? mapDboToUser(dbo) : null;
  }

  /**
   * Returns the `User` with the corresponding `userId` or `null` if none were found.
   */
  public async getUserById(userId: string): Promise<User> {
    const dbo = await this.userCollection.findOne({ _id: new ObjectId(userId) });
    return dbo ? mapDboToUser(dbo) : null;
  }

  /**
   * Saves a `user` to the DB or updates an existing one.
   */
  public async save(user: User): Promise<User> {
    const dboToSave = {
      _id: user.id ? new ObjectId(user.id) : new ObjectId(),
      name: user.name,
      wallets: user.wallets,
      email: user.email,
      kacheAssetAccountMyobId: user.kacheAssetAccountMyobId,
      companyFileMyobId: user.companyFileMyobId,
      myobId: user.myobId,
      myobRefreshToken: user.myobRefreshToken,
    };

    await this.userCollection.updateOne({ _id: dboToSave._id }, { $set: dboToSave }, { upsert: true });

    return mapDboToUser(dboToSave);
  }

  /**
   * Returns a list of ethereum addresses belonging to all users.
   */
  public async listEthereumAddressesToMonitor(): Promise<string[]> {
    return (await this.list()).flatMap((user) => user.wallets.flatMap((wallet) => wallet.address));
  }

}

function mapDboToUser(dbo: Object): User {
  return {
    id: String(dbo['_id']),
    name: dbo['name'],
    email: dbo['email'],
    wallets: dbo['wallets'],
    companyFileMyobId: dbo["companyFileMyobId"],
    ...(dbo['myobId'] && {myobId: dbo['myobId']}),
    ...(dbo['kacheAssetAccountMyobId'] && {kacheAssetAccountMyobId: dbo['kacheAssetAccountMyobId']}),
    ...(dbo['myobRefreshToken'] && {myobRefreshToken: dbo['myobRefreshToken']})
  };
}

export {
  mapDboToUser,
  UserRepository,
};
