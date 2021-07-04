import { Router } from 'express';

import EnrollReportsController from '../controllers/EnrollReportsController';
import EnrollsController from '../controllers/EnrollsController';

const enrollsRouter = Router();

const enrollsController = new EnrollsController();
const enrollReportsController = new EnrollReportsController();

enrollsRouter.get('/reports', enrollReportsController.index);
enrollsRouter.put('/reports', enrollReportsController.update);

enrollsRouter.post('/', enrollsController.create);
enrollsRouter.get('/', enrollsController.index);

enrollsRouter.get('/count', enrollsController.count);
enrollsRouter.get('/:enroll_id', enrollsController.show);

export default enrollsRouter;
