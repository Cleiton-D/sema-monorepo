import { Router } from 'express';

import SchoolYearsController from '../controllers/SchoolYearsController';

const schoolYearRouter = Router();

const schoolYearsController = new SchoolYearsController();

schoolYearRouter.post('/', schoolYearsController.create);
schoolYearRouter.get('/', schoolYearsController.index);
schoolYearRouter.get('/:school_year_id', schoolYearsController.show);
schoolYearRouter.put('/:school_year_id', schoolYearsController.update);
schoolYearRouter.patch('/:school_year_id', schoolYearsController.finish);

export default schoolYearRouter;
