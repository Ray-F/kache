import { Router } from 'express';
import { DefaultController } from '../controller/DefaultController';
import { WalletController } from '../controller/WalletController';

/*
 * Main routing file to manage all application route.
 */

const router = Router();

const defaultController = new DefaultController();

// Wallet
const walletController = new WalletController();
const walletRouter = Router();
router.use('/api', walletRouter);
walletRouter.use('/transactions', walletController.transactionsReceived);
walletRouter.use('/balance', walletController.balance);

router.use('/api', defaultController.api404);

export default router;
