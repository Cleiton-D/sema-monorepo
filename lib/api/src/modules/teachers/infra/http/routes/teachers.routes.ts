import { Router } from 'express';

import TeachersController from '../controllers/TeachersController';

const teachersRouter = Router();

const teachersController = new TeachersController();

teachersRouter.get('/', teachersController.index);

export default teachersRouter;
