import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IAccessModulesRepository from '../repositories/IAccessModulesRepository';
import AccessModule from '../infra/typeorm/entities/AccessModule';

type VerifyProfileAccess = {
  module: string;
  access_level_id: string;
};

@injectable()
class VerifyProfileAccessService {
  constructor(
    @inject('AccessModulesRepository')
    private accessModulesRepository: IAccessModulesRepository,
  ) {}

  public async execute({
    access_level_id,
    module,
  }: VerifyProfileAccess): Promise<AccessModule> {
    const accessModule = await this.accessModulesRepository.findOne({
      access_level_id,
      module_name: module,
    });

    if (!accessModule) {
      throw new AppError('You dont have permission to access this module');
    }

    return accessModule;
  }
}

export default VerifyProfileAccessService;
