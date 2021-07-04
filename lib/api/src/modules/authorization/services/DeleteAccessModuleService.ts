import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

import IAccessModulesRepository from '../repositories/IAccessModulesRepository';

type DeleteAccessModuleRequest = {
  access_module_id: string;
};

@injectable()
class DeleteAccessModuleService {
  constructor(
    @inject('AccessModulesRepository')
    private accessModulesRepository: IAccessModulesRepository,
  ) {}

  public async execute({
    access_module_id,
  }: DeleteAccessModuleRequest): Promise<void> {
    const accessModule = await this.accessModulesRepository.findOne({
      id: access_module_id,
    });
    if (!accessModule) {
      throw new AppError('Access module not found');
    }

    await this.accessModulesRepository.delete(accessModule);
  }
}

export default DeleteAccessModuleService;
