import { Router } from 'express';

import databaseRouter from './database.routes';
import systemBackgroundsRouter from './system_backgrounds.routes';

const adminRouter = Router();

adminRouter.use('/database', databaseRouter);
adminRouter.use('/background', systemBackgroundsRouter);

export default adminRouter;
