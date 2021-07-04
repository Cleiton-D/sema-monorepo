import { inject, injectable } from 'tsyringe';

import AccessModule from '../infra/typeorm/entities/AccessModule';
import IAccessLevelsRepository from '../repositories/IAccessLevelsRepository';
import IAccessModulesRepository from '../repositories/IAccessModulesRepository';
import IAppModulesRepository from '../repositories/IAppModulesRepository';
import CreateAccessModuleDTO from '../dtos/CreateAccessModuleDTO';

type CreateAccessModuleRequest = Array<{
  access_level_id: string;
  module_id: string;
  read: boolean;
  write: boolean;
}>;

type MappedAccessAndModules = {
  accessLevels: string[];
  modules: string[];
};

type CreateUpdateAccessModules = {
  newItems: CreateAccessModuleDTO[];
  updateItems: AccessModule[];
};

@injectable()
class CreateAccessModuleService {
  constructor(
    @inject('AccessModulesRepository')
    private accessModulesRepository: IAccessModulesRepository,
    @inject('AppModulesRepository')
    private appModulesRepository: IAppModulesRepository,
    @inject('AccessLevelsRepository')
    private accessLevelsRepository: IAccessLevelsRepository,
  ) {}

  public async execute(
    items: CreateAccessModuleRequest,
  ): Promise<AccessModule[]> {
    const { accessLevels, modules } = items.reduce<MappedAccessAndModules>(
      (acc, item) => {
        const { accessLevels: levels, modules: modles } = acc;

        return {
          ...acc,
          accessLevels: [...levels, item.access_level_id],
          modules: [...modles, item.module_id],
        };
      },
      {
        accessLevels: [],
        modules: [],
      },
    );

    const currentAccessModules = await this.accessModulesRepository.findAll({
      access_level_id: accessLevels,
      module_id: modules,
    });

    const { newItems, updateItems } = items.reduce<CreateUpdateAccessModules>(
      (acc, item) => {
        const { newItems: nwItems, updateItems: updItems } = acc;

        const currentItem = currentAccessModules.find(
          ({ app_module_id, access_level_id }) =>
            app_module_id === item.module_id &&
            access_level_id === item.access_level_id,
        );
        if (!currentItem) {
          nwItems.push({
            access_level_id: item.access_level_id,
            module_id: item.module_id,
            read: item.read,
            write: item.write,
          });
        } else {
          const newItem = Object.assign(currentItem, {
            read: item.read,
            write: item.write,
          });
          updItems.push(newItem);
        }

        return { ...acc, newItems: nwItems, updateItems: updItems };
      },
      {
        newItems: [],
        updateItems: [],
      },
    );

    const createdItems = await this.accessModulesRepository.createMany(
      newItems,
    );
    const updatedItems = await this.accessModulesRepository.updateMany(
      updateItems,
    );

    return [...createdItems, ...updatedItems];
  }
}

export default CreateAccessModuleService;
