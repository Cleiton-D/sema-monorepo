import { Router } from 'express';

import AccessLevelsController from '../controllers/AccessLevelsController';

const accessLevelsRouter = Router();

const accessLevelsController = new AccessLevelsController();

accessLevelsRouter.get('/', accessLevelsController.index);
accessLevelsRouter.post('/', accessLevelsController.create);
accessLevelsRouter.delete('/:access_level_id', accessLevelsController.delete);

export default accessLevelsRouter;
