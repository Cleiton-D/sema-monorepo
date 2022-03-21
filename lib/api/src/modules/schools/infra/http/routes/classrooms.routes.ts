import { Router } from 'express';

import ClassroomsController from '../controllers/ClassroomsController';

const classroomRouter = Router({ mergeParams: true });

const classroomController = new ClassroomsController();

classroomRouter.post('/', classroomController.create);
classroomRouter.get('/', classroomController.index);

classroomRouter.get('/count', classroomController.count);
classroomRouter.get('/:classroom_id', classroomController.show);

classroomRouter.delete('/:classroom_id', classroomController.delete);
classroomRouter.put('/:classroom_id', classroomController.update);

export default classroomRouter;
