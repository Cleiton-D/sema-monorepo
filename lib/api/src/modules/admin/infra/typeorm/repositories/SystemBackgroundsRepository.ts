import { FindOptionsWhere, Repository } from 'typeorm';

import { dataSource } from '@config/data_source';

import ISystemBackgroundsRepository from '@modules/admin/repositories/ISystemBackgroundsRepository';
import CreateSystemBackgroundDTO from '@modules/admin/dtos/CreateSystemBackgroundDTO';

import FindSystemBackgroundDTO from '@modules/admin/dtos/FindSystemBackgroundDTO';
import SystemBackground from '../entities/SystemBackground';

class SystemBackgroundsRepository implements ISystemBackgroundsRepository {
  private ormRepository: Repository<SystemBackground>;

  constructor() {
    this.ormRepository = dataSource.getRepository(SystemBackground);
  }

  public async findOne({
    current_defined,
    id,
  }: FindSystemBackgroundDTO): Promise<SystemBackground | undefined> {
    const where: FindOptionsWhere<SystemBackground> = {};

    if (id) where.id = id;
    if (typeof current_defined !== 'undefined') {
      where.current_defined = current_defined;
    }

    const systemBackgrounds = await this.ormRepository.findOne({ where });
    return systemBackgrounds ?? undefined;
  }

  public async findAll({
    current_defined,
    id,
  }: FindSystemBackgroundDTO): Promise<SystemBackground[]> {
    const where: FindOptionsWhere<SystemBackground> = {};

    if (id) where.id = id;
    if (typeof current_defined !== 'undefined') {
      where.current_defined = current_defined;
    }

    const systemBackgrounds = await this.ormRepository.find({ where });
    return systemBackgrounds;
  }

  public async create({
    name,
    blurhash,
    current_defined,
  }: CreateSystemBackgroundDTO): Promise<SystemBackground> {
    const systemBackground = this.ormRepository.create({
      name,
      blurhash,
      current_defined,
    });
    await this.ormRepository.save(systemBackground);

    return systemBackground;
  }

  public async update(
    systemBackground: SystemBackground,
  ): Promise<SystemBackground> {
    await this.ormRepository.save(systemBackground);
    return systemBackground;
  }

  public async updateMany(
    systemBackgrounds: SystemBackground[],
  ): Promise<SystemBackground[]> {
    await this.ormRepository.save(systemBackgrounds);
    return systemBackgrounds;
  }

  public async delete(systemBackground: SystemBackground): Promise<void> {
    await this.ormRepository.remove(systemBackground);
  }
}

export default SystemBackgroundsRepository;
