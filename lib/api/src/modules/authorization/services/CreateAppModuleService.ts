import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import AppModule from '../infra/typeorm/entities/AppModule';
import IAppModulesRepository from '../repositories/IAppModulesRepository';
import IAccessLevelsRepository from '../repositories/IAccessLevelsRepository';
import CreateAccessModuleService from './CreateAccessModuleService';

type CreateAppModuleRequest = {
  description: string;
};

@injectable()
class CreateAppModuleService {
  constructor(
    @inject('AppModulesRepository')
    private appModulesRepository: IAppModulesRepository,
    @inject('AccessLevelsRepository')
    private accessLevelsRepository: IAccessLevelsRepository,
    private createAccessModules: CreateAccessModuleService,
  ) {}

  public async execute({
    description,
  }: CreateAppModuleRequest): Promise<AppModule> {
    const existAppModule = await this.appModulesRepository.findByName(
      description,
    );

    if (existAppModule) {
      throw new AppError('Already exists an application module with this name');
    }

    const appModule = await this.appModulesRepository.create({ description });

    const accessLevels = await this.accessLevelsRepository.findAll({});
    const accessModulesObj = accessLevels.map(({ id, code }) => ({
      access_level_id: id,
      module_id: appModule.id,
      read: code === 'administrator',
      write: code === 'administrator',
    }));

    await this.createAccessModules.execute(accessModulesObj);

    return appModule;
  }
}

export default CreateAppModuleService;
