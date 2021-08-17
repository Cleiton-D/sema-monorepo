import { getRepository, In, MigrationInterface, Not } from 'typeorm';

import AccessLevel from '@modules/authorization/infra/typeorm/entities/AccessLevel';
import AccessModule from '@modules/authorization/infra/typeorm/entities/AccessModule';
import AppModule from '@modules/authorization/infra/typeorm/entities/AppModule';

export default class SetAccessToProfiles1626625009454
  implements MigrationInterface {
  public async up(): Promise<void> {
    const accessLevelsRepository = getRepository(AccessLevel);
    const appModulesRepository = getRepository(AppModule);
    const accessModulesRepository = getRepository(AccessModule);

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
    const accessLevelsRepository = getRepository(AccessLevel);
    const accessModulesRepository = getRepository(AccessModule);

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
