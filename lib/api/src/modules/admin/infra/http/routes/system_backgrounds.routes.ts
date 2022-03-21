import { Router } from 'express';

import SystemBackgroundsController from '../controllers/SystemBackgroundsController';

const systemBackgroundsRouter = Router();

const systemBackgroundsController = new SystemBackgroundsController();

systemBackgroundsRouter.post('/', systemBackgroundsController.create);
systemBackgroundsRouter.get('/current', systemBackgroundsController.current);

export default systemBackgroundsRouter;
