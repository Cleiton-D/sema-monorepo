import { Router } from 'express';

import AttendancesController from '../controllers/AttendancesController';
import ClassesController from '../controllers/ClassesController';

const classesRouter = Router();

const classesController = new ClassesController();
const attendancesController = new AttendancesController();

classesRouter.get('/', classesController.index);
classesRouter.get('/count', classesController.count);
classesRouter.get('/:class_id', classesController.show);
classesRouter.post('/', classesController.create);
classesRouter.put('/:class_id/finish', classesController.finish);

classesRouter.put('/:class_id/attendances', attendancesController.update);
classesRouter.get('/:class_id/attendances', attendancesController.index);

export default classesRouter;
