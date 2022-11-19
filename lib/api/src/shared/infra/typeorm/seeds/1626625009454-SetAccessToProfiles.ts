import { In, MigrationInterface, Not } from 'typeorm';

import { dataSource } from '@config/data_source';

import AccessLevel from '@modules/authorization/infra/typeorm/entities/AccessLevel';
import AccessModule from '@modules/authorization/infra/typeorm/entities/AccessModule';
import AppModule from '@modules/authorization/infra/typeorm/entities/AppModule';

export default class SetAccessToProfiles1626625009454
  implements MigrationInterface
{
  public async up(): Promise<void> {
    const accessLevelsRepository = dataSource.getRepository(AccessLevel);
    const appModulesRepository = dataSource.getRepository(AppModule);
    const accessModulesRepository = dataSource.getRepository(AccessModule);

    const accessLevels = await accessLevelsRepository.find({
      where: {
        code: Not('administrator'),
      },
    });

    const modules = await appModulesRepository.find();
    const accessModules = accessLevels.reduce<AccessModule[]>((acc, item) => {
      const itemsOfThisAccess = modules.map(({ id }) =>
        accessModulesRepository.create({
          access_level_id: item.id,
          app_module_id: id,
          read: false,
          write: false,
        }),
      );

      return [...acc, ...itemsOfThisAccess];
    }, []);

    await accessModulesRepository.save(accessModules);
  }

  public async down(): Promise<void> {
    const accessLevelsRepository = dataSource.getRepository(AccessLevel);
    const accessModulesRepository = dataSource.getRepository(AccessModule);

    const accessLevels = await accessLevelsRepository.find({
      where: {
        code: Not('administrator'),
      },
    });
    const accessLevelIds = accessLevels.map(({ id }) => id);

    const accessModules = await accessModulesRepository.find({
      where: {
        access_level_id: In(accessLevelIds),
      },
    });
    await Promise.all(
      accessModules.map(accessModule =>
        accessModulesRepository.remove(accessModule),
      ),
    );
  }
}
