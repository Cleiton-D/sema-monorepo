import { Router } from 'express';

import multigradesClassroomsRouter from './multigrades_classrooms.routes';

import MultigradesController from '../controllers/MultigradesController';

const multigradesRouter = Router({ mergeParams: true });

const multigradesController = new MultigradesController();

multigradesRouter.get('/', multigradesController.index);
multigradesRouter.get('/:multigrade_id', multigradesController.show);
multigradesRouter.use('/:owner_id/classrooms', multigradesClassroomsRouter);

// classroomRouter.get('/count', classroomController.count);
// classroomRouter.get('/:classroom_id', classroomController.show);

// classroomRouter.delete('/:classroom_id', classroomController.delete);

export default multigradesRouter;
