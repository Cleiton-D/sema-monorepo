import { getRepository, Raw, Repository } from 'typeorm';

import CreateAppModuleDTO from '@modules/authorization/dtos/CreateAppModuleDTO';
import IAppModulesRepository from '@modules/authorization/repositories/IAppModulesRepository';

import AppModule from '../entities/AppModule';

class AppModulesRepository implements IAppModulesRepository {
  private ormRepository: Repository<AppModule>;

  constructor() {
    this.ormRepository = getRepository(AppModule);
  }

  public async findById(id: string): Promise<AppModule | undefined> {
    const appModule = await this.ormRepository.findOne(id);
    return appModule;
  }

  public async findByName(name: string): Promise<AppModule | undefined> {
    const appModule = await this.ormRepository.findOne({
      where: {
        description: Raw(
          descriptionFieldName => `${descriptionFieldName} ILIKE '${name}'`,
        ),
      },
    });

    return appModule;
  }

  public async findAll(): Promise<AppModule[]> {
    const appModules = await this.ormRepository.find();
    return appModules;
  }

  public async create({ description }: CreateAppModuleDTO): Promise<AppModule> {
    const appModule = this.ormRepository.create({ description });
    await this.ormRepository.save(appModule);

    return appModule;
  }
}

export default AppModulesRepository;
