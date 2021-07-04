import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUserProfilesRepository from '../repositories/IUserProfilesRepository';

type DeleteUserProfileRequest = {
  user_profile_id?: string;
  user_id?: string;
  branch_id?: string;
  access_level_id?: string;
  access_level_name: string;
};

@injectable()
class DeleteUserProfileService {
  constructor(
    @inject('UserProfilesRepository')
    private userProfilesRepository: IUserProfilesRepository,
  ) {}

  public async execute({
    user_profile_id,
    user_id,
    branch_id,
    access_level_id,
    access_level_name,
  }: DeleteUserProfileRequest): Promise<void> {
    const userProfile = user_profile_id
      ? await this.userProfilesRepository.findOne({
          id: user_profile_id,
        })
      : await this.userProfilesRepository.findOne({
          user_id,
          branch_id,
          access_level_id,
          access_level_name,
        });

    if (!userProfile) {
      throw new AppError('Profile not fount');
    }

    await this.userProfilesRepository.delete(userProfile);
  }
}

export default DeleteUserProfileService;
