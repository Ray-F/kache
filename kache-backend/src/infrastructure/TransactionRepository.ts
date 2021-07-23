import { MongoAdapter } from './MongoAdapter';
import { Collection, ObjectId } from 'mongodb';
import { UserTransaction } from '../model/UserTransaction';
import { mapDboToUser } from './UserRepository';

class TransactionRepository {

  private transactionCollection: Collection;

  constructor(mongoAdapter: MongoAdapter) {
    this.transactionCollection = mongoAdapter.db.collection('transactions');
  }

  /**
   * Returns a list of all transactions.
   */
  async list(): Promise<UserTransaction[]> {
    const pipeline = [
      {
        '$lookup': {
          'from': 'users',
          'localField': 'userId',
          'foreignField': '_id',
          'as': 'user',
        },
      },
    ];

    const dboList = await this.transactionCollection.aggregate(pipeline).toArray();

    return dboList.map((dbo) => mapDboToTransaction(dbo));
  }

  /**
   * Returns the UserTransaction associated with `transactionId` or `null` if it does not exist.
   */
  async getTransactionById(transactionId: string): Promise<UserTransaction> {
    const dbo = await this.transactionCollection.findOne({ _id: new ObjectId(transactionId) })

    return dbo ? mapDboToTransaction(dbo) : null;
  }

  /**
   * Saves a `transaction` to the DB.
   */
  async save(transaction: UserTransaction): Promise<UserTransaction> {
    const objectToSave = {
      // New object or old object
      _id: transaction.id ? new ObjectId(transaction.id) : new ObjectId(),
      userId: new ObjectId(transaction.user.id),
      cryptoTransaction: transaction.cryptoTransaction,
    };

    const filter = { _id: objectToSave._id };
    const update = { $set: objectToSave };
    const options = { upsert: true };

    await this.transactionCollection.updateOne(filter, update, options);

    return { id: String(objectToSave._id), ...transaction };
  }

}

function mapDboToTransaction(dbo: object): UserTransaction {
  return {
    id: String(dbo['_id']),
    user: mapDboToUser(dbo['user']),
    cryptoTransaction: dbo['cryptoTransaction'],
  };
}

export {
  TransactionRepository,
};
