import { Raw, Repository } from 'typeorm';

import { dataSource } from '@config/data_source';

import CreateAppModuleDTO from '@modules/authorization/dtos/CreateAppModuleDTO';
import IAppModulesRepository from '@modules/authorization/repositories/IAppModulesRepository';

import AppModule from '../entities/AppModule';

class AppModulesRepository implements IAppModulesRepository {
  private ormRepository: Repository<AppModule>;

  constructor() {
    this.ormRepository = dataSource.getRepository(AppModule);
  }

  public async findById(id: string): Promise<AppModule | undefined> {
    const appModule = await this.ormRepository.findOne({
      where: { id },
    });
    return appModule ?? undefined;
  }

  public async findByName(name: string): Promise<AppModule | undefined> {
    const appModule = await this.ormRepository.findOne({
      where: {
        description: Raw(
          descriptionFieldName => `${descriptionFieldName} ILIKE '${name}'`,
        ),
      },
    });

    return appModule ?? undefined;
  }

  public async findAll(): Promise<AppModule[]> {
    const appModules = await this.ormRepository.find({});
    return appModules;
  }

  public async create({ description }: CreateAppModuleDTO): Promise<AppModule> {
    const appModule = this.ormRepository.create({ description });
    await this.ormRepository.save(appModule);

    return appModule;
  }
}

export default AppModulesRepository;
