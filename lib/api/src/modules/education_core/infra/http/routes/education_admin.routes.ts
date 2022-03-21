import { Router } from 'express';

import schoolYearRouter from './school_year.routes';
import gradesRouter from './grades.routes';
import schoolSubjectsRouter from './school_subjects.routes';
import classPeriodsRouter from './class_periods.routes';
import schoolTermPeriodsRouter from './school_term_periods.routes';

const educationAdminRouter = Router();

educationAdminRouter.use('/school-years', schoolYearRouter);
educationAdminRouter.use('/grades', gradesRouter);
educationAdminRouter.use('/school-subjects', schoolSubjectsRouter);

educationAdminRouter.use('/class-periods', classPeriodsRouter);
educationAdminRouter.use('/school-term-periods', schoolTermPeriodsRouter);

export default educationAdminRouter;
