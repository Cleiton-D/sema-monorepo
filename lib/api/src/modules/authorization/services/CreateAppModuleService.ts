import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import AppModule from '../infra/typeorm/entities/AppModule';
import IAppModulesRepository from '../repositories/IAppModulesRepository';

type CreateAppModuleRequest = {
  description: string;
};

@injectable()
class CreateAppModuleService {
  constructor(
    @inject('AppModulesRepository')
    private appModulesRepository: IAppModulesRepository,
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
    return appModule;
  }
}

export default CreateAppModuleService;
