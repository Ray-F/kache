import { BaseController } from './BaseController';
import { Request, Response } from 'express';
import { EtherAdapter } from '../../infrastructure/repository/EtherAdapter';
import Config from '../../util/Config';

const etherAdapter = new EtherAdapter(Config.ETH_NODE_URL, Config.ETHERSCAN_API_KEY);

class DefaultController extends BaseController {

  /**
   * Returns balance of an ethereum wallet based on the wallet's address.
   */
  async balance(req: Request, res: Response) {
    const bal = await etherAdapter.queryAddressBalance(req.query.address as string);
    res.json(bal);
  }

  /**
   * Default landing page for non implemented /api route.
   */
  async api404(req: Request, res: Response) {
    res.send(`
      <h2>MERN-Template Express API</h2>
      <p>
      This route has not yet been implemented, and you have reached the default
      landing page for the <code>/api</code> endpoint. 
      <br />
      The template this application extends from can be found on GitHub 
      <a href="https://www.github.com/ray-f/mern-template">here</a>.
      </p>
    `);
  }
}

export { DefaultController };
