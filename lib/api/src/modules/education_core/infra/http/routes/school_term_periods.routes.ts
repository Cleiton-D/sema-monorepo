import { Router } from 'express';

import SchoolTermPeriodsController from '../controllers/SchoolTermPeriodsController';

const schoolTermPeriodsRouter = Router();

const schoolTermPeriodsController = new SchoolTermPeriodsController();

schoolTermPeriodsRouter.get('/', schoolTermPeriodsController.index);
schoolTermPeriodsRouter.get('/show', schoolTermPeriodsController.show);
schoolTermPeriodsRouter.post('/', schoolTermPeriodsController.create);
schoolTermPeriodsRouter.put('/:id', schoolTermPeriodsController.update);

export default schoolTermPeriodsRouter;
