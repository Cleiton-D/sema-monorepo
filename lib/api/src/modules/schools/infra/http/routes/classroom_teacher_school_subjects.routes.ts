import { Router } from 'express';
import ClassroomTeacherSchoolSubjectsController from '../controllers/ClassroomTeacherSchoolSubjectsController';

const classroomTeacherSchoolSubjectsRouter = Router({ mergeParams: true });

const classroomTeacherSchoolSubjectsController =
  new ClassroomTeacherSchoolSubjectsController();

classroomTeacherSchoolSubjectsRouter.get(
  '/',
  classroomTeacherSchoolSubjectsController.index,
);
classroomTeacherSchoolSubjectsRouter.post(
  '/',
  classroomTeacherSchoolSubjectsController.create,
);
classroomTeacherSchoolSubjectsRouter.get(
  '/:classroom_teacher_school_subject_id',
  classroomTeacherSchoolSubjectsController.show,
);
classroomTeacherSchoolSubjectsRouter.delete(
  '/:classroom_teacher_school_subject_id',
  classroomTeacherSchoolSubjectsController.delete,
);

export default classroomTeacherSchoolSubjectsRouter;
