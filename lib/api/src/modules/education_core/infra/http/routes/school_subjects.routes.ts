import { Router } from 'express';

import SchoolSubjectsController from '../controllers/SchoolSubjectsController';

const schoolSubjectsRouter = Router();

const schoolSubjectsController = new SchoolSubjectsController();

schoolSubjectsRouter.get('/', schoolSubjectsController.index);
schoolSubjectsRouter.get('/count', schoolSubjectsController.count);
schoolSubjectsRouter.get('/:school_subject_id', schoolSubjectsController.show);
schoolSubjectsRouter.post('/', schoolSubjectsController.create);
schoolSubjectsRouter.put(
  '/:school_subject_id',
  schoolSubjectsController.update,
);
schoolSubjectsRouter.delete(
  '/:school_subject_id',
  schoolSubjectsController.delete,
);

export default schoolSubjectsRouter;
