import { Router } from 'express';

import AppModulesController from '../controllers/AppModulesController';

const appModulesRouter = Router();

const appModulesController = new AppModulesController();

appModulesRouter.get('/', appModulesController.index);
appModulesRouter.post('/', appModulesController.create);

export default appModulesRouter;
