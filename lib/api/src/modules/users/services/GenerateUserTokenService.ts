import { inject, injectable } from 'tsyringe';
import { sign } from 'jsonwebtoken';

import ShowSchoolYearService from '@modules/education_core/services/ShowSchoolYearService';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUserProfilesRepository from '../repositories/IUserProfilesRepository';
import UserProfile from '../infra/typeorm/entities/UserProfile';

type GenerateUserTokenRequest = {
  user_id: string;
  user_profile_id?: string;
  school_year_id?: string;
};

type GenerateUserTokenResponse = {
  token: string;
  school_year_id?: string;
  profile?: UserProfile;
};

@injectable()
class GenerateUserTokenService {
  constructor(
    @inject('UserProfilesRepository')
    private userProfilesRepository: IUserProfilesRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
    private showSchoolYear: ShowSchoolYearService,
  ) {}

  public async execute({
    user_id,
    user_profile_id,
    school_year_id,
  }: GenerateUserTokenRequest): Promise<GenerateUserTokenResponse> {
    const userProfile = await this.getUserProfile(user_id, user_profile_id);

    if (user_profile_id && !userProfile) {
      throw new AppError('Profile not found');
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({ pfl: userProfile?.id }, secret, {
      subject: user_id,
      expiresIn,
    });

    const schoolYear = await this.showSchoolYear
      .execute({
        school_year_id: school_year_id || 'current',
      })
      .catch(() => undefined);

    return { token, profile: userProfile, school_year_id: schoolYear?.id };
  }

  private async getUserProfile(
    user_id: string,
    user_profile_id?: string,
  ): Promise<UserProfile | undefined> {
    if (user_profile_id) {
      return this.userProfilesRepository.findOne({ id: user_profile_id });
    }

    const userProfile = await this.userProfilesRepository.findOne({
      user_id,
      default: true,
    });
    if (userProfile) return userProfile;

    const [firstUserProfile] = await this.userProfilesRepository.findAll({
      user_id,
    });

    return firstUserProfile;
  }
}

export default GenerateUserTokenService;
