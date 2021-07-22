import app from './App';
import serverless from 'serverless-http';

module.exports.handler = serverless(app);
