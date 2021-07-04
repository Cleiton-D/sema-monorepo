import CreateAccessModuleDTO from '../dtos/CreateAccessModuleDTO';
import FindAccessModuleDTO from '../dtos/FindAccessModuleDTO';
import AccessModule from '../infra/typeorm/entities/AccessModule';

export default interface IAccessModulesRepository {
  findOne: (filters: FindAccessModuleDTO) => Promise<AccessModule | undefined>;
  findAll: (filters: FindAccessModuleDTO) => Promise<AccessModule[]>;
  create: (data: CreateAccessModuleDTO) => Promise<AccessModule>;
  createMany: (data: CreateAccessModuleDTO[]) => Promise<AccessModule[]>;
  update: (accessModule: AccessModule) => Promise<AccessModule>;
  updateMany: (accessModule: AccessModule[]) => Promise<AccessModule[]>;
  delete: (accessModule: AccessModule) => Promise<void>;
}
