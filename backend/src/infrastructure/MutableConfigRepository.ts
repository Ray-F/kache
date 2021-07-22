import { MongoAdapter } from './MongoAdapter';
import { Collection } from 'mongodb';
import { BlockTag } from '@ethersproject/providers';

class MutableConfigRepository {

  private configCollection: Collection;

  constructor(mongoAdapter: MongoAdapter) {
    this.configCollection = mongoAdapter.db.collection("config");
  }

  /**
   * Gets the blockchain ID (number) of the last blockchain that was read.
   * @return {number}
   */
  public async getLastBlockRead(): Promise<BlockTag> {
    const singletonConfig = await this.configCollection.findOne({});

    return singletonConfig["lastBlockRead"] as BlockTag;
  }

  /**
   * Sets the "lastBlockRead" property in the config collection.
   * @param {BlockTag} block
   * @return {Promise<void>}
   */
  public async setLatestBlockRead(block: BlockTag) {
    const update = {
      "$set" : {
        "lastBlockRead": block as number
      }
    }
    await this.configCollection.updateOne({}, update)
  }
}

export {
  MutableConfigRepository
}
