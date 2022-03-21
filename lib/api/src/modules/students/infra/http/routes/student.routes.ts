import { Router } from 'express';

import StudentsController from '../controllers/StudentsController';

const studentRouter = Router();

const studentsController = new StudentsController();

studentRouter.get('/', studentsController.index);
studentRouter.post('/', studentsController.create);

studentRouter.get('/:id', studentsController.show);

export default studentRouter;
