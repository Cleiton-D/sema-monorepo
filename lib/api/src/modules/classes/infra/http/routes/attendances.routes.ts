import { Router } from 'express';

import AttendancesController from '../controllers/AttendancesController';

const attendancesRouter = Router();

const attendancesController = new AttendancesController();

attendancesRouter.put('/', attendancesController.update);
attendancesRouter.get('/', attendancesController.index);
attendancesRouter.get('/by-classes', attendancesController.indexByClasses);
attendancesRouter.get('/count', attendancesController.count);
attendancesRouter.post('/add', attendancesController.add);

attendancesRouter.patch(
  '/:attendance_id/justify',
  attendancesController.justify,
);
attendancesRouter.delete(
  '/:attendance_id/justify',
  attendancesController.removeJustify,
);

export default attendancesRouter;
