import SystemBackground from '../infra/typeorm/entities/SystemBackground';

import CreateSystemBackgroundDTO from '../dtos/CreateSystemBackgroundDTO';
import FindSystemBackgroundDTO from '../dtos/FindSystemBackgroundDTO';

export default interface ISystemBackgroundsRepository {
  create: (data: CreateSystemBackgroundDTO) => Promise<SystemBackground>;
  findAll: (filters: FindSystemBackgroundDTO) => Promise<SystemBackground[]>;
  findOne: (
    filters: FindSystemBackgroundDTO,
  ) => Promise<SystemBackground | undefined>;
  update: (systemBackground: SystemBackground) => Promise<SystemBackground>;
  updateMany: (
    systemBackgrounds: SystemBackground[],
  ) => Promise<SystemBackground[]>;
}
