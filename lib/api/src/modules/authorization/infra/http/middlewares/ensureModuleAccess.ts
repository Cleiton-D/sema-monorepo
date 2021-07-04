import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ShowUserProfileService from '@modules/users/services/ShowUserProfileService';
import UserProfile from '@modules/users/infra/typeorm/entities/UserProfile';
import VerifyProfileAccessService from '@modules/authorization/services/VerifyProfileAccessService';
import AccessModule from '@modules/authorization/infra/typeorm/entities/AccessModule';

type EnsureModuleAccessRequest = {
  module: string;
  user_profile_id?: string;
  rule?: 'READ' | 'WRITE';
};

type EnsureModuleAccessResponse = {
  userProfile: UserProfile;
  accessModule: AccessModule;
};

const ensureModuleAccess = async ({
  user_profile_id,
  module,
  rule,
}: EnsureModuleAccessRequest): Promise<EnsureModuleAccessResponse> => {
  const showUserProfile = container.resolve(ShowUserProfileService);
  const userProfile = await showUserProfile.execute({ user_profile_id });

  const verifyProfileAccess = container.resolve(VerifyProfileAccessService);
  const accessModule = await verifyProfileAccess.execute({
    access_level_id: userProfile.access_level_id,
    module,
  });

  if (rule) {
    if (rule === 'READ' && !accessModule.read) {
      throw new AppError('You dont has access to this module');
    }
    if (rule === 'WRITE' && !accessModule.write) {
      throw new AppError('You dont has access to this module');
    }
  }

  return { userProfile, accessModule };
};

export default ensureModuleAccess;
