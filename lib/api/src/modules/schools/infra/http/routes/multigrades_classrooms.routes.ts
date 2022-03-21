import { Router } from 'express';

import MultigradesClassroomsController from '../controllers/MultigradesClassroomsController';

const multigradesClassroomsRouter = Router({ mergeParams: true });

const multigradesClassroomsController = new MultigradesClassroomsController();

multigradesClassroomsRouter.get('/', multigradesClassroomsController.index);
multigradesClassroomsRouter.post('/', multigradesClassroomsController.create);

multigradesClassroomsRouter.delete(
  '/:multigrade_classroom_id',
  multigradesClassroomsController.delete,
);

export default multigradesClassroomsRouter;
