import { getRepository, MigrationInterface } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import UserProfile from '@modules/users/infra/typeorm/entities/UserProfile';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import AccessLevel from '@modules/authorization/infra/typeorm/entities/AccessLevel';

export default class CreateAdminUser1624323334330
  implements MigrationInterface {
  public async up(): Promise<void> {
    const usersRepository = getRepository(User);
    const accessLevelsRepository = getRepository(AccessLevel);
    const userProfilesRepository = getRepository(UserProfile);

    const password = await new BCryptHashProvider().generateHash('admin');
    const user = usersRepository.create({
      login: 'admin@admin.com',
      username: 'Admin',
      password,
      change_password: false,
    });

    const adminAccess = await accessLevelsRepository.findOne({
      where: {
        code: 'administrator',
      },
    });
    if (!adminAccess) {
      throw new Error('Administrator access level not found');
    }

    await usersRepository.save(user);
    const profile = userProfilesRepository.create({
      access_level_id: adminAccess.id,
      description: 'Administrador',
      user_id: user.id,
      default_profile: true,
    });

    await userProfilesRepository.save(profile);
  }

  public async down(): Promise<void> {
    console.info('down');
  }
}
