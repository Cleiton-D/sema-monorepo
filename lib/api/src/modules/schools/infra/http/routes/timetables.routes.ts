import { Router } from 'express';

import TimetablesController from '../controllers/TimetablesController';

const timetableRouter = Router({ mergeParams: true });
const timetablesController = new TimetablesController();

timetableRouter.put('/', timetablesController.update);

timetableRouter.get('/validate', timetablesController.validate);
timetableRouter.get('/', timetablesController.index);

export default timetableRouter;
