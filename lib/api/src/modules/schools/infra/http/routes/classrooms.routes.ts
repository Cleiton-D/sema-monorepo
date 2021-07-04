import { Router } from 'express';

import ClassroomsController from '../controllers/ClassroomsController';
import TimetablesController from '../controllers/TimetablesController';

import classroomTeacherSchoolSubjectsRouter from './classroom_teacher_school_subjects.routes';

const classroomRouter = Router({ mergeParams: true });

const classroomController = new ClassroomsController();
const timetablesController = new TimetablesController();

classroomRouter.post('/', classroomController.create);
classroomRouter.get('/', classroomController.index);

classroomRouter.get('/count', classroomController.count);
classroomRouter.get('/:classroom_id', classroomController.show);

classroomRouter.delete('/:classroom_id', classroomController.delete);
classroomRouter.put('/:classroom_id/timetables', timetablesController.update);

classroomRouter.use(
  '/:classroom_id/teacher-school-subjects',
  classroomTeacherSchoolSubjectsRouter,
);

export default classroomRouter;
