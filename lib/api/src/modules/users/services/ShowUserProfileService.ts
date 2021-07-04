import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import UserProfile from '../infra/typeorm/entities/UserProfile';
import IUserProfilesRepository from '../repositories/IUserProfilesRepository';

type FindUserProfileRequest = {
  user_profile_id?: string;
};

@injectable()
class FindUserService {
  constructor(
    @inject('UserProfilesRepository')
    private userProfilesRepository: IUserProfilesRepository,
  ) {}

  public async execute({
    user_profile_id,
  }: FindUserProfileRequest): Promise<UserProfile> {
    if (!user_profile_id) {
      throw new AppError('You dont have an profile', 401);
    }

    const userProfile = await this.userProfilesRepository.findOne({
      id: user_profile_id,
    });

    if (!userProfile) {
      throw new AppError('Profile not exist');
    }

    return userProfile;
  }
}

export default FindUserService;
