import { inject, injectable } from 'tsyringe';

import AppModule from '../infra/typeorm/entities/AppModule';
import IAppModulesRepository from '../repositories/IAppModulesRepository';

@injectable()
class ListAppModulesService {
  constructor(
    @inject('AppModulesRepository')
    private appModulesRepository: IAppModulesRepository,
  ) {}

  public async execute(): Promise<AppModule[]> {
    const appModules = await this.appModulesRepository.findAll();
    return appModules;
  }
}

export default ListAppModulesService;
