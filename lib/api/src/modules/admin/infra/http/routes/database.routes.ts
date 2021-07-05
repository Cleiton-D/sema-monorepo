import { Router } from 'express';

import DatabaseController from '../controllers/DatabaseController';

const databaseRouter = Router();

const databaseController = new DatabaseController();

databaseRouter.get('/dump', databaseController.dump);

export default databaseRouter;
