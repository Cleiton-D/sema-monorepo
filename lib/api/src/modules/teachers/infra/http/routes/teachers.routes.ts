import { Router } from 'express';

import TeachersController from '../controllers/TeachersController';

const teachersRouter = Router();

const teachersController = new TeachersController();

teachersRouter.post('/', teachersController.create);

export default teachersRouter;
