import {
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';

import { dataSource } from '@config/data_source';

import FindUserProfileDTO from '@modules/users/dtos/FindUserProfileDTO';
import CreateUserProfileDTO from '@modules/users/dtos/CreateUserProfileDTO';

import IUserProfilesRepository from '@modules/users/repositories/IUserProfilesRepository';
import UserProfile from '../entities/UserProfile';

type AndWhere = {
  condition: string;
  parameters?: ObjectLiteral;
};

class UserProfilesRepository implements IUserProfilesRepository {
  private ormRepository: Repository<UserProfile>;

  constructor() {
    this.ormRepository = dataSource.getRepository(UserProfile);
  }

  public async findOne({
    id,
    user_id,
    branch_id,
    access_level_id,
    access_level_name,
    default: isDefault,
  }: FindUserProfileDTO): Promise<UserProfile | undefined> {
    const where: FindOptionsWhere<UserProfile> = {};
    const andWhere: AndWhere[] = [];

    if (id) where.id = id;
    if (user_id) where.user_id = user_id;
    if (branch_id) where.branch_id = branch_id;
    if (access_level_id) where.access_level_id = access_level_id;
    if (isDefault) where.default_profile = isDefault;

    if (access_level_name) {
      andWhere.push({
        condition: 'access_level.code = :accessLevelCode',
        parameters: { accessLevelCode: access_level_name },
      });
    }

    const queryBuilder = this.ormRepository
      .createQueryBuilder('user_profile')
      .select()
      .where((qb: WhereExpressionBuilder) => {
        qb.where(where);

        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      })
      .leftJoinAndSelect('user_profile.access_level', 'access_level')
      .leftJoinAndSelect('user_profile.branch', 'branch');

    const userProfile = await queryBuilder.getOne();

    return userProfile ?? undefined;
  }

  public async findAll({
    id,
    user_id,
    branch_id,
    access_level_id,
    access_level_name,
    default: isDefault,
  }: FindUserProfileDTO): Promise<UserProfile[]> {
    const where: FindOptionsWhere<UserProfile> = {};
    const andWhere: AndWhere[] = [];

    if (id) where.id = id;
    if (user_id) where.user_id = user_id;
    if (branch_id) where.branch_id = branch_id;
    if (access_level_id) where.access_level_id = access_level_id;
    if (isDefault) where.default_profile = isDefault;

    if (access_level_name) {
      andWhere.push({
        condition: 'access_level.code = :accessLevelCode',
        parameters: { accessLevelCode: access_level_name },
      });
    }

    const queryBuilder = this.ormRepository
      .createQueryBuilder('user_profile')
      .select()
      .where((qb: WhereExpressionBuilder) => {
        qb.where(where);

        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      })
      .leftJoinAndSelect('user_profile.access_level', 'access_level')
      .leftJoinAndSelect('user_profile.branch', 'branch');

    const userProfiles = await queryBuilder.getMany();

    return userProfiles;
  }

  public async create({
    user_id,
    branch_id,
    access_level_id,
    description,
    default_profile,
  }: CreateUserProfileDTO): Promise<UserProfile> {
    const userProfile = this.ormRepository.create({
      user_id,
      branch_id,
      access_level_id,
      description,
      default_profile,
    });
    await this.ormRepository.save(userProfile);

    return userProfile;
  }

  public async delete(userProfile: UserProfile): Promise<void> {
    await this.ormRepository.remove(userProfile);
  }
}

export default UserProfilesRepository;
