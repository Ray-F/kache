import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_WALLET_ADDRESS = '0xc4B7faE9ea8bEc3F1966Db6c89F404173D5398ea';

const {
  MONGODB_URI,
  ETH_NODE_URL,
  ETHERSCAN_API_KEY,
  COINLAYER_ACCESS_KEY
} = process.env;

/*
 * The default port of the application
 */
const PORT = process.env.PORT || 9002;

export default {
  COINLAYER_ACCESS_KEY,
  DEFAULT_WALLET_ADDRESS,
  ETHERSCAN_API_KEY,
  ETH_NODE_URL,
  PORT,
  MONGODB_URI,
};
