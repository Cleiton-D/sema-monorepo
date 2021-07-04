import { Router } from 'express';

import BranchsController from '../controllers/BranchsController';

const branchsRouter = Router();

const branchsController = new BranchsController();

branchsRouter.get('/show', branchsController.show);
branchsRouter.get('/:branch_id', branchsController.show);
branchsRouter.get('/', branchsController.index);

export default branchsRouter;
