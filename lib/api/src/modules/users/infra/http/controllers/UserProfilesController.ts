import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserProfileService from '@modules/users/services/CreateUserProfileService';
import ListUserProfilesService from '@modules/users/services/ListUserProfilesService';
import privateRoute from '@shared/decorators/privateRoute';
import DeleteUserProfileService from '@modules/users/services/DeleteUserProfileService';

class UserProfilesController {
  @privateRoute()
  public async index(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.query;

    const listUserProfiles = container.resolve(ListUserProfilesService);
    const userProfiles = await listUserProfiles.execute({
      user_id: user_id as string,
    });

    return response.json(userProfiles);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { user_id, branch_id, access_level_id, accessCode } = request.body;

    const createUserProfile = container.resolve(CreateUserProfileService);

    const userProfile = await createUserProfile.execute({
      user_id,
      branch_id,
      access_level_id,
      access_level_name: accessCode,
    });

    return response.json(userProfile);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { user_profile_id } = request.params;
    const { user_id, branch_id, access_level_id, accessCode } = request.body;

    const deleteUserProfile = container.resolve(DeleteUserProfileService);
    await deleteUserProfile.execute({
      user_profile_id,
      user_id,
      branch_id,
      access_level_id,
      access_level_name: accessCode,
    });

    return response.status(204).send();
  }
}

export default UserProfilesController;
