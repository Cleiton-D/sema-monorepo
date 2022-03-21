import { Router } from 'express';

import ClassPeriodsController from '../controllers/ClassPeriodsController';

const classPeriodsRouter = Router();

const classPeriodsController = new ClassPeriodsController();

classPeriodsRouter.get('/', classPeriodsController.index);
classPeriodsRouter.post('/', classPeriodsController.create);
classPeriodsRouter.delete('/:class_period_id', classPeriodsController.delete);

export default classPeriodsRouter;
