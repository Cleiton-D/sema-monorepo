import { Router } from 'express';

import AccessModulesController from '../controllers/AccessModulesController';

const accessModuleRouter = Router();

const accessModulesController = new AccessModulesController();

accessModuleRouter.get('/', accessModulesController.index);
accessModuleRouter.get('/mine', accessModulesController.indexMine);
accessModuleRouter.post('/', accessModulesController.create);
accessModuleRouter.delete('/:access_module_id', accessModulesController.delete);

export default accessModuleRouter;
