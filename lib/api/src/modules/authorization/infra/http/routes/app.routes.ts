import { Router } from 'express';

import appModulesRouter from './appModules.routes';
import accessLevelsRouter from './accessLevels.routes';
import accessModulesRouter from './accessModules.routes';
import branchsRouter from './branchs.routes';

const appRouter = Router();

appRouter.use('/modules', appModulesRouter);
appRouter.use('/access-levels', accessLevelsRouter);
appRouter.use('/access-modules', accessModulesRouter);
appRouter.use('/branchs', branchsRouter);

export default appRouter;
