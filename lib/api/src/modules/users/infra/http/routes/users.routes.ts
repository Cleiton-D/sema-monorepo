import { Router } from 'express';
import UsersController from '../controllers/UsersController';

const usersRouter = Router();

const usersController = new UsersController();

usersRouter.post('/', usersController.create);
usersRouter.get('/', usersController.index);
usersRouter.get('/me', usersController.show_me);
usersRouter.put('/:user_id/password', usersController.update_password);
usersRouter.delete('/:user_id', usersController.delete);

export default usersRouter;
