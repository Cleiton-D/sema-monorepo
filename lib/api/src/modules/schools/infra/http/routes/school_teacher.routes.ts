import { Router } from 'express';
import SchoolTeachersController from '../controllers/SchoolTeachersController';

const schoolTeachersRouter = Router({ mergeParams: true });

const schoolTeachersController = new SchoolTeachersController();

schoolTeachersRouter.get('/count', schoolTeachersController.count);
schoolTeachersRouter.get('/', schoolTeachersController.index);
schoolTeachersRouter.post('/', schoolTeachersController.create);
schoolTeachersRouter.delete(
  '/:school_teacher_id',
  schoolTeachersController.delete,
);

export default schoolTeachersRouter;
