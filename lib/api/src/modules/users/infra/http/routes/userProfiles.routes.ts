import { Router } from 'express';

import UserProfilesController from '../controllers/UserProfilesController';

const userProfilesRouter = Router();

const userProfilesController = new UserProfilesController();

userProfilesRouter.get('/', userProfilesController.index);
userProfilesRouter.post('/', userProfilesController.create);
userProfilesRouter.delete('/', userProfilesController.delete);
userProfilesRouter.delete('/:user_profile_id', userProfilesController.delete);

export default userProfilesRouter;
