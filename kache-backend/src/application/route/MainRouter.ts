import { Router } from 'express';
import { DefaultController } from '../controller/DefaultController';
import { AutomationController } from '../controller/AutomationController';
import { ClientController } from '../controller/ClientController';

/*
 * Main routing file to manage all application route.
 */

const router = Router();

const defaultController = new DefaultController();

// Automation controller and routes
const automationController = new AutomationController();
const automationRouter = Router();
router.use('/api/automation', automationRouter);
automationRouter.use('/query-blockchain-payments', automationController.runPaymentCheck);

// Client controller and routes for our frontend
const clientController = new ClientController();
const clientRouter = Router();
router.use('/api/client', clientRouter);
clientRouter.use('/onboard-unlinked', clientController.createNewUnlinkedUser);
clientRouter.use('/myob_callback', clientController.linkUserOnMyob);
clientRouter.use('/exchange', clientController.getCurrentExchange);

router.use('/api', defaultController.api404);

export default router;
