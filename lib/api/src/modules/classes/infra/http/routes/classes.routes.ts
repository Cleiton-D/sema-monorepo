import { Router } from 'express';

import ClassesController from '../controllers/ClassesController';

const classesRouter = Router();

const classesController = new ClassesController();

classesRouter.get('/', classesController.index);
classesRouter.get('/count', classesController.count);
classesRouter.get('/:class_id', classesController.show);
classesRouter.post('/', classesController.create);
classesRouter.put('/:class_id', classesController.update);
classesRouter.delete('/:class_id', classesController.delete);

classesRouter.put('/:class_id/finish', classesController.finish);

export default classesRouter;
