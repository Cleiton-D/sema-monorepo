import { Router } from 'express';

import gradeSchoolSubjectsRouter from './grade_school_subjects.routes';

import GradesController from '../controllers/GradesController';

const gradesRouter = Router();

const gradesController = new GradesController();

gradesRouter.get('/count', gradesController.count);
gradesRouter.get('/', gradesController.index);
gradesRouter.post('/', gradesController.create);
gradesRouter.delete('/:grade_id', gradesController.delete);
gradesRouter.use('/:grade_id/school-subjects', gradeSchoolSubjectsRouter);

export default gradesRouter;
