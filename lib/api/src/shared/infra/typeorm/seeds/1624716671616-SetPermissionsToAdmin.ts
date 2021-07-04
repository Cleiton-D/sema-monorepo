import { getRepository, MigrationInterface } from 'typeorm';

import AccessLevel from '@modules/authorization/infra/typeorm/entities/AccessLevel';
import AccessModule from '@modules/authorization/infra/typeorm/entities/AccessModule';
import AppModule from '@modules/authorization/infra/typeorm/entities/AppModule';

export default class SetPermissionsToAdmin1624716671616
  implements MigrationInterface {
  public async up(): Promise<void> {
    const accessLevelsRepository = getRepository(AccessLevel);
    const appModulesRepository = getRepository(AppModule);
    const accessModulesRepository = getRepository(AccessModule);

    const adminAccess = await accessLevelsRepository.findOne({
      where: {
        code: 'administrator',
      },
    });
    if (!adminAccess) {
      throw new Error('Administrator access level not found');
    }

    const modules = await appModulesRepository.find();
    const accessModules = modules.map(({ id }) =>
      accessModulesRepository.create({
        access_level_id: adminAccess.id,
        app_module_id: id,
        read: true,
        write: true,
      }),
    );
    await accessModulesRepository.save(accessModules);
  }

  public async down(): Promise<void> {
    const accessLevelsRepository = getRepository(AccessLevel);
    const accessModulesRepository = getRepository(AccessModule);

    const adminAccess = await accessLevelsRepository.findOne({
      where: {
        code: 'administrator',
      },
    });
    if (!adminAccess) {
      throw new Error('Administrator access level not found');
    }

    const accessModules = await accessModulesRepository.find({
      where: {
        access_level_id: adminAccess.id,
      },
    });
    await Promise.all(
      accessModules.map(accessModule =>
        accessModulesRepository.remove(accessModule),
      ),
    );
  }
}
