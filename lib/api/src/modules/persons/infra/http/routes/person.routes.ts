import { Router } from 'express';

import PersonsController from '../controllers/PersonsController';

const personRouter = Router();

const personsController = new PersonsController();

personRouter.get('/:person_id', personsController.show);

export default personRouter;
