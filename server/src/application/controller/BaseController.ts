import { MongoAdapter } from '../../infrastructure/MongoAdapter';
import Config from '../../util/Config';

// TODO: Replace this db-name with the correct name
MongoAdapter.build(Config.MONGODB_URI, 'kache-dev');

/**
 * The root controller that all other controllers will extend from.
 */
class BaseController {}

export { BaseController };
