import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const ETH_NODE_URL = process.env.ETH_NODE_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const DEFAULT_WALLET_ADDRESS = "0xc4B7faE9ea8bEc3F1966Db6c89F404173D5398ea"

/*
 * The default port of the application
 */
const PORT = process.env.PORT || 9002;

export default {
  DEFAULT_WALLET_ADDRESS,
  ETHERSCAN_API_KEY,
  ETH_NODE_URL,
  PORT,
  MONGODB_URI,
};
