import { Router } from 'express';

import SchoolTermPeriodsController from '../controllers/SchoolTermPeriodsController';

const schoolTermPeriodsRouter = Router();

const schoolTermPeriodsController = new SchoolTermPeriodsController();

schoolTermPeriodsRouter.get('/', schoolTermPeriodsController.index);
schoolTermPeriodsRouter.post('/', schoolTermPeriodsController.create);

export default schoolTermPeriodsRouter;
