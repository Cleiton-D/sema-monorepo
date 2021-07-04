import { inject, injectable } from 'tsyringe';

import UserProfile from '../infra/typeorm/entities/UserProfile';
import IUserProfilesRepository from '../repositories/IUserProfilesRepository';

type ListUserProfilesRequest = {
  user_id: string;
};

@injectable()
class ListUserProfilesService {
  constructor(
    @inject('UserProfilesRepository')
    private userProfilesRepository: IUserProfilesRepository,
  ) {}

  public async execute({
    user_id,
  }: ListUserProfilesRequest): Promise<UserProfile[]> {
    const userProfiles = await this.userProfilesRepository.findAll({
      user_id,
    });

    return userProfiles;
  }
}

export default ListUserProfilesService;
