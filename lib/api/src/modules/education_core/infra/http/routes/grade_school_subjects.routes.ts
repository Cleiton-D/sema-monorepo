import { Router } from 'express';

import GradeSchoolSubjectsController from '../controllers/GradeSchoolSubjectsController';

const gradeSchoolSubjectsRouter = Router({ mergeParams: true });

const gradeSchoolSubjectsController = new GradeSchoolSubjectsController();

gradeSchoolSubjectsRouter.get('/', gradeSchoolSubjectsController.index);
gradeSchoolSubjectsRouter.post('/', gradeSchoolSubjectsController.create);
gradeSchoolSubjectsRouter.put(
  '/:grade_school_subject_id',
  gradeSchoolSubjectsController.update,
);
gradeSchoolSubjectsRouter.delete(
  '/:grade_school_subject_id',
  gradeSchoolSubjectsController.delete,
);

export default gradeSchoolSubjectsRouter;
