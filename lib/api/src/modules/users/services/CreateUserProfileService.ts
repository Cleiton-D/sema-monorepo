import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IBranchRepository from '@modules/authorization/repositories/IBranchRepository';
import IAccessLevelsRepository from '@modules/authorization/repositories/IAccessLevelsRepository';
import UserProfile from '../infra/typeorm/entities/UserProfile';

import IUserProfilesRepository from '../repositories/IUserProfilesRepository';
import IUsersRepository from '../repositories/IUsersRepository';

type CreateUserProfileRequest = {
  user_id: string;
  branch_id: string;
  access_level_id?: string;
  default_profile?: boolean;
  access_level_name?: string;
};

@injectable()
class CreateUserProfileService {
  constructor(
    @inject('UserProfilesRepository')
    private userProfilesRepository: IUserProfilesRepository,
    @inject('BranchRepository') private branchRepository: IBranchRepository,
    @inject('AccessLevelsRepository')
    private accessLevelsRepository: IAccessLevelsRepository,
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    branch_id,
    access_level_id,
    access_level_name,
  }: CreateUserProfileRequest): Promise<UserProfile> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found');
    }

    const branch = await this.branchRepository.findOne({ id: branch_id });
    if (!branch) {
      throw new AppError('Branch not found');
    }

    const accessLevel = await this.accessLevelsRepository.findOne({
      id: access_level_id,
      code: access_level_name,
    });
    if (!accessLevel) {
      throw new AppError('Access level not found');
    }

    const userProfiles = await this.userProfilesRepository.findAll({
      user_id,
    });

    const userProfileAlreadyExists = userProfiles.find(
      userProfile =>
        userProfile.branch_id === branch_id &&
        userProfile.access_level_id === access_level_id,
    );
    if (userProfileAlreadyExists) {
      throw new AppError('User profile already exists');
    }

    const description = `${accessLevel.description} - ${branch.description}`;

    const userProfile = await this.userProfilesRepository.create({
      user_id,
      branch_id,
      access_level_id: accessLevel.id,
      description,
      default_profile: !userProfiles.length,
    });

    return userProfile;
  }
}

export default CreateUserProfileService;
