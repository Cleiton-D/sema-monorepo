import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/storage';

import SystemBackgroundsController from '../controllers/SystemBackgroundsController';

const systemBackgroundsRouter = Router();

const systemBackgroundsController = new SystemBackgroundsController();

const multerUpload = multer(uploadConfig.multer);

systemBackgroundsRouter.post(
  '/',
  multerUpload.any(),
  systemBackgroundsController.create,
);
systemBackgroundsRouter.get('/', systemBackgroundsController.index);
systemBackgroundsRouter.get('/current', systemBackgroundsController.current);
systemBackgroundsRouter.patch(
  '/current',
  systemBackgroundsController.changeCurrent,
);
systemBackgroundsRouter.delete(
  '/:system_background_id',
  systemBackgroundsController.delete,
);

export default systemBackgroundsRouter;
