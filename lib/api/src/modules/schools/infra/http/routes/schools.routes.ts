import { Router } from 'express';

import SchoolsController from '../controllers/SchoolsController';

import schoolTeachersRouter from './school_teacher.routes';
import teacherSchoolSubjectsRouter from './teacher_school_subjects.routes';

const schoolsRouter = Router();

const schoolsController = new SchoolsController();

schoolsRouter.get('/count', schoolsController.count);
schoolsRouter.get('/:school_id', schoolsController.show);
schoolsRouter.get('/', schoolsController.index);
schoolsRouter.post('/', schoolsController.create);
schoolsRouter.put('/:school_id', schoolsController.update);

// schoolsRouter.use('/:school_id/classrooms', classroomsRouter);
schoolsRouter.use('/:school_id/teachers', schoolTeachersRouter);
schoolsRouter.use(
  '/:school_id/teacher-school-subjects',
  teacherSchoolSubjectsRouter,
);

export default schoolsRouter;
