import { inject, injectable } from 'tsyringe';

import AccessLevel from '../infra/typeorm/entities/AccessLevel';
import { BranchType } from '../infra/typeorm/entities/Branch';
import IAccessLevelsRepository from '../repositories/IAccessLevelsRepository';
import IAppModulesRepository from '../repositories/IAppModulesRepository';
import CreateAccessModuleService from './CreateAccessModuleService';

type CreateAccessLevelRequest = {
  description: string;
  code: string;
  only_on: BranchType;
};

@injectable()
class CreateAccessLevelService {
  constructor(
    @inject('AccessLevelsRepository')
    private accessLevelsRepository: IAccessLevelsRepository,
    @inject('AppModulesRepository')
    private appModulesRepository: IAppModulesRepository,
    private createAccessModules: CreateAccessModuleService,
  ) {}

  public async execute({
    description,
    code,
    only_on,
  }: CreateAccessLevelRequest): Promise<AccessLevel> {
    const accessLevel = await this.accessLevelsRepository.create({
      description,
      code,
      only_on,
      editable: true,
    });

    const modules = await this.appModulesRepository.findAll();
    const accessModulesObj = modules.map(({ id }) => ({
      access_level_id: accessLevel.id,
      module_id: id,
      read: accessLevel.code === 'administrator',
      write: accessLevel.code === 'administrator',
    }));

    await this.createAccessModules.execute(accessModulesObj);

    return accessLevel;
  }
}

export default CreateAccessLevelService;
