import { Router } from 'express';

import AdressesController from '../controllers/AdressesController';

const adressesRouter = Router();

const adressesController = new AdressesController();

adressesRouter.post('/', adressesController.create);

export default adressesRouter;
