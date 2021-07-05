import { Router } from 'express';

import databaseRouter from './database.routes';

const adminRouter = Router();

adminRouter.use('/database', databaseRouter);

export default adminRouter;
