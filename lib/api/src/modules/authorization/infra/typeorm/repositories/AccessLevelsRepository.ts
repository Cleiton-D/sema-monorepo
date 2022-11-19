import { FindOptionsWhere, Repository } from 'typeorm';

import { dataSource } from '@config/data_source';

import CreateAccessLevelDTO from '@modules/authorization/dtos/CreateAccessLevelDTO';
import IAccessLevelsRepository from '@modules/authorization/repositories/IAccessLevelsRepository';

import FindAccessLevelDTO from '@modules/authorization/dtos/FindAccessLevelDTO';
import AccessLevel from '../entities/AccessLevel';

class AccessLevelsRepository implements IAccessLevelsRepository {
  private ormRepository: Repository<AccessLevel>;

  constructor() {
    this.ormRepository = dataSource.getRepository(AccessLevel);
  }

  public async findOne({
    id,
    description,
    code,
  }: FindAccessLevelDTO): Promise<AccessLevel | undefined> {
    const where: FindOptionsWhere<AccessLevel> = {};

    if (id) where.id = id;
    if (description) where.description = description;
    if (code) where.code = code;

    const accessLevel = await this.ormRepository.findOne({ where });
    return accessLevel ?? undefined;
  }

  public async findAll({
    id,
    description,
    code,
  }: FindAccessLevelDTO): Promise<AccessLevel[]> {
    const where: FindOptionsWhere<AccessLevel> = {};

    if (id) where.id = id;
    if (description) where.description = description;
    if (code) where.code = code;

    const accessLevel = await this.ormRepository.find({ where });
    return accessLevel;
  }

  public async create({
    description,
    code,
    only_on,
    editable,
  }: CreateAccessLevelDTO): Promise<AccessLevel> {
    const accessLevel = this.ormRepository.create({
      description,
      code,
      only_on,
      editable,
    });

    await this.ormRepository.save(accessLevel);

    return accessLevel;
  }

  public async delete(accessLevel: AccessLevel): Promise<void> {
    await this.ormRepository.remove(accessLevel);
  }
}

export default AccessLevelsRepository;
