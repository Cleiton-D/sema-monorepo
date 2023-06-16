import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import VerifyProfileAccessService from '@modules/authorization/services/VerifyProfileAccessService';
import AccessModule from '@modules/authorization/infra/typeorm/entities/AccessModule';

type EnsureModuleAccessRequest = {
  module: string;
  access_level_id?: string;
  rule?: 'READ' | 'WRITE';
};

type EnsureModuleAccessResponse = {
  accessModule: AccessModule;
};

const ensureModuleAccess = async ({
  access_level_id,
  module,
  rule,
}: EnsureModuleAccessRequest): Promise<EnsureModuleAccessResponse> => {
  if (!access_level_id) {
    throw new AppError('You dont has access to this module');
  }

  const verifyProfileAccess = container.resolve(VerifyProfileAccessService);
  const accessModule = await verifyProfileAccess.execute({
    access_level_id,
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

  return { accessModule };
};

export default ensureModuleAccess;
