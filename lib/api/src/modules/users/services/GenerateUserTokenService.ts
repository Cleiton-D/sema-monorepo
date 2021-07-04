import { inject, injectable } from 'tsyringe';
import { sign } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUserProfilesRepository from '../repositories/IUserProfilesRepository';
import UserProfile from '../infra/typeorm/entities/UserProfile';

type GenerateUserTokenRequest = {
  user_id: string;
  user_profile_id?: string;
};

type GenerateUserTokenResponse = {
  token: string;
  profile?: UserProfile;
};

@injectable()
class GenerateUserTokenService {
  constructor(
    @inject('UserProfilesRepository')
    private userProfilesRepository: IUserProfilesRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    user_profile_id,
  }: GenerateUserTokenRequest): Promise<GenerateUserTokenResponse> {
    const userProfile = user_profile_id
      ? await this.userProfilesRepository.findOne({ id: user_profile_id })
      : await this.userProfilesRepository.findOne({ user_id, default: true });

    if (user_profile_id && !userProfile) {
      throw new AppError('Profile not found');
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({ pfl: userProfile?.id }, secret, {
      subject: user_id,
      expiresIn,
    });

    return { token, profile: userProfile };
  }
}

export default GenerateUserTokenService;
