import { Router } from 'express';

import AttendancesController from '../controllers/AttendancesController';

const attendancesRouter = Router();

const attendancesController = new AttendancesController();

attendancesRouter.put('/', attendancesController.update);
attendancesRouter.get('/', attendancesController.index);

export default attendancesRouter;
