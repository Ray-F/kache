import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const ETH_NODE_URL = process.env.ETH_NODE_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

/*
 * The default port of the application
 */
const PORT = process.env.PORT || 9002;

export default {
  ETHERSCAN_API_KEY,
  ETH_NODE_URL,
  PORT,
  MONGODB_URI,
};
