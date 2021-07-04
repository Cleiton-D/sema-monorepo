import { inject, injectable } from 'tsyringe';

import AccessModule from '../infra/typeorm/entities/AccessModule';
import IAccessModulesRepository from '../repositories/IAccessModulesRepository';

type ListAccessModuleRequest = {
  access_level_id: string;
};

@injectable()
class ListAccessModulesService {
  constructor(
    @inject('AccessModulesRepository')
    private accessModulesRepository: IAccessModulesRepository,
  ) {}

  public async execute({
    access_level_id,
  }: ListAccessModuleRequest): Promise<AccessModule[]> {
    const accessModules = await this.accessModulesRepository.findAll({
      access_level_id,
    });

    return accessModules;
  }
}

export default ListAccessModulesService;
