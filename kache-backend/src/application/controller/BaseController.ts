import { MongoAdapter } from '../../infrastructure/MongoAdapter';
import Config from '../../util/Config';
import { Response } from 'express';

MongoAdapter.build(Config.MONGODB_URI, 'kache-dev');

/**
 * The root controller that all other controllers will extend from.
 */
class BaseController {}

function createJson(res: Response, status: number = 200, message?: string, payload?: any) {
  res.json({
             status: status,
             ...(message && { message }),
             ...(payload && { payload }),
           });
}

export {
  BaseController,
  createJson,
};
