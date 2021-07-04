import {
  FindConditions,
  getRepository,
  In,
  ObjectLiteral,
  Repository,
  WhereExpression,
} from 'typeorm';

import CreateAccessModuleDTO from '@modules/authorization/dtos/CreateAccessModuleDTO';
import IAccessModulesRepository from '@modules/authorization/repositories/IAccessModulesRepository';
import FindAccessModuleDTO from '@modules/authorization/dtos/FindAccessModuleDTO';

import AccessModule from '../entities/AccessModule';

type AndWhere = {
  condition: string;
  parameters?: ObjectLiteral;
};

class AccessModulesRepository implements IAccessModulesRepository {
  private ormRepository: Repository<AccessModule>;

  constructor() {
    this.ormRepository = getRepository(AccessModule);
  }

  private mountQuery({
    id,
    access_level_id,
    module_id,
    module_name,
    read,
    write,
  }: FindAccessModuleDTO) {
    const where: FindConditions<AccessModule> = {};
    const andWhere: AndWhere[] = [];

    if (id) where.id = id;
    if (read) where.read = read;
    if (write) where.write = write;
    if (access_level_id) {
      if (Array.isArray(access_level_id)) {
        where.access_level_id = In(access_level_id);
      } else {
        where.access_level_id = access_level_id;
      }
    }
    if (module_id) {
      if (Array.isArray(module_id)) {
        where.app_module_id = In(module_id);
      } else {
        where.app_module_id = module_id;
      }
    }

    if (module_name) {
      andWhere.push({
        condition: 'app_module.description = :moduleName',
        parameters: { moduleName: module_name },
      });
    }

    return {
      join: {
        alias: 'access_module',
        innerJoinAndSelect: {
          app_module: 'access_module.app_module',
        },
      },
      where: (qb: WhereExpression) => {
        qb.where(where);

        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      },
    };
  }

  public async findOne(
    filters: FindAccessModuleDTO,
  ): Promise<AccessModule | undefined> {
    const accessModule = await this.ormRepository.findOne(
      this.mountQuery(filters),
    );

    return accessModule;
  }

  public async findAll(filters: FindAccessModuleDTO): Promise<AccessModule[]> {
    const accessModules = await this.ormRepository.find(
      this.mountQuery(filters),
    );
    return accessModules;
  }

  public async create({
    access_level_id,
    module_id,
    read,
    write,
  }: CreateAccessModuleDTO): Promise<AccessModule> {
    const accessModule = this.ormRepository.create({
      access_level_id,
      app_module_id: module_id,
      read,
      write,
    });
    await this.ormRepository.save(accessModule);

    return accessModule;
  }

  public async createMany(
    data: CreateAccessModuleDTO[],
  ): Promise<AccessModule[]> {
    const accessModules = data.map(
      ({ access_level_id, module_id, read, write }) =>
        this.ormRepository.create({
          access_level_id,
          app_module_id: module_id,
          read,
          write,
        }),
    );

    await this.ormRepository.save(accessModules);
    return accessModules;
  }

  public async update(accessModule: AccessModule): Promise<AccessModule> {
    await this.ormRepository.save(accessModule);
    return accessModule;
  }

  public async updateMany(
    accessModules: AccessModule[],
  ): Promise<AccessModule[]> {
    await this.ormRepository.save(accessModules);
    return accessModules;
  }

  public async delete(accessModule: AccessModule): Promise<void> {
    await this.ormRepository.remove(accessModule);
  }
}

export default AccessModulesRepository;
