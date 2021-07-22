import { Router } from 'express';
import { DefaultController } from '../controller/DefaultController';
import { ActionController } from '../controller/ActionController';

/*
 * Main routing file to manage all application route.
 */

const router = Router();

const defaultController = new DefaultController();

// Action controller and routes
const actionController = new ActionController();
const actionRouter = Router();
router.use('/api/action', actionRouter);

actionRouter.use('/query-blockchain-payments', actionController.runPaymentCheck);

router.use('/api', defaultController.api404);

export default router;
