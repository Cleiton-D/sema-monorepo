import { Router } from 'express';
import StudentsController from '../controllers/StudentsController';

const studentRouter = Router();

const studentsController = new StudentsController();

studentRouter.post('/', studentsController.create);

export default studentRouter;
