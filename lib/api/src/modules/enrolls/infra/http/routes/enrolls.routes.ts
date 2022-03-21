import { Router } from 'express';

import EnrollsController from '../controllers/EnrollsController';
import EnrollReportsController from '../controllers/EnrollReportsController';
import EnrollClassroomsController from '../controllers/EnrollClassroomsController';

const enrollsRouter = Router();

const enrollsController = new EnrollsController();
const enrollReportsController = new EnrollReportsController();
const enrollClassroomsController = new EnrollClassroomsController();

enrollsRouter.get('/reports', enrollReportsController.index);
enrollsRouter.put('/reports', enrollReportsController.update);

enrollsRouter.get('/classrooms', enrollClassroomsController.index);

enrollsRouter.post('/', enrollsController.create);
enrollsRouter.get('/', enrollsController.index);

enrollsRouter.get('/count', enrollsController.count);
enrollsRouter.get('/:enroll_id', enrollsController.show);
enrollsRouter.put('/:enroll_id', enrollsController.update);
enrollsRouter.patch('/:enroll_id', enrollsController.relocate);

export default enrollsRouter;
