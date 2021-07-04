import CreateAppModuleDTO from '../dtos/CreateAppModuleDTO';
import AppModule from '../infra/typeorm/entities/AppModule';

export default interface IAppModulesRepository {
  create: (data: CreateAppModuleDTO) => Promise<AppModule>;
  findByName: (name: string) => Promise<AppModule | undefined>;
  findById: (id: string) => Promise<AppModule | undefined>;
  findAll: () => Promise<AppModule[]>;
}
