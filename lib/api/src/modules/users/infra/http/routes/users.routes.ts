import { Router } from 'express';
import UsersController from '../controllers/UsersController';

const usersRouter = Router();

const usersController = new UsersController();

usersRouter.post('/', usersController.create);
usersRouter.get('/', usersController.index);
usersRouter.get('/me', usersController.show_me);
usersRouter.get('/count', usersController.count);
usersRouter.put('/:user_id/password', usersController.update_password);
usersRouter.delete('/:user_id', usersController.delete);
usersRouter.patch('/reset-pass', usersController.reset_password);

export default usersRouter;
