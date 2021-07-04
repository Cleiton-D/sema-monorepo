import { Router } from 'express';

import TeacherSchoolSubjectsController from '../controllers/TeacherSchoolSubjectsController';

const teacherSchoolSubjectsRouter = Router({ mergeParams: true });

const teacherSchoolSubjectsController = new TeacherSchoolSubjectsController();

teacherSchoolSubjectsRouter.get('/', teacherSchoolSubjectsController.index);
teacherSchoolSubjectsRouter.post('/', teacherSchoolSubjectsController.create);
teacherSchoolSubjectsRouter.delete(
  '/:teacher_school_subject_id',
  teacherSchoolSubjectsController.delete,
);

export default teacherSchoolSubjectsRouter;
