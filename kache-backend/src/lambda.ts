import app from './application/App';
import serverless from 'serverless-http';

module.exports.handler = serverless(app);
