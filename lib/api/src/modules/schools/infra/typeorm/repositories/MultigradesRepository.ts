import { FindOptionsWhere, Repository, ILike } from 'typeorm';

import { dataSource } from '@config/data_source';

import IMultigradesRepository from '@modules/schools/repositories/IMultigradesRepository';
import FindMultigradesDTO from '@modules/schools/dtos/FindMultigradesDTO';
import Multigrade from '../entities/Multigrade';

class MultigradesRepository implements IMultigradesRepository {
  private ormRepository: Repository<Multigrade>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Multigrade);
  }

  public async findOne({
    id,
    description,
    class_period_id,
    school_id,
    school_year_id,
  }: FindMultigradesDTO): Promise<Multigrade | undefined> {
    const where: FindOptionsWhere<Multigrade> = {};
    if (id) where.id = id;
    if (description) where.description = ILike(`%${description}%`);
    if (class_period_id) where.class_period_id = class_period_id;
    if (school_id) where.school_id = school_id;
    if (school_year_id) where.school_year_id = school_year_id;

    const multigrade = await this.ormRepository.findOne({ where });
    return multigrade ?? undefined;
  }

  public async findAll({
    description,
    class_period_id,
    school_id,
    school_year_id,
  }: FindMultigradesDTO): Promise<Multigrade[]> {
    const queryBuilder = this.ormRepository.createQueryBuilder('multigrade');

    queryBuilder.andWhere(`multigrade.is_multigrade = :isMultigrade`, {
      isMultigrade: true,
    });

    if (description) {
      queryBuilder.andWhere(`multigrade.description = :description`, {
        description,
      });
    }

    if (class_period_id) {
      queryBuilder.andWhere(`multigrade.class_period_id = :classPeriod`, {
        classPeriod: class_period_id,
      });
    }

    if (school_id) {
      queryBuilder.andWhere(`multigrade.school_id = :schoolId`, {
        schoolId: school_id,
      });
    }

    if (school_year_id) {
      queryBuilder.andWhere(`multigrade.school_year_id = :schoolYearId`, {
        schoolYearId: school_year_id,
      });
    }

    queryBuilder
      .innerJoinAndSelect('multigrade.class_period', 'class_period')
      .innerJoinAndSelect('multigrade.school', 'school')
      .leftJoinAndSelect(
        'multigrade.multigrade_classrooms',
        'multigrade_classrooms',
      )
      .leftJoinAndSelect('multigrade_classrooms.classroom', 'classrooms')
      .loadRelationCountAndMap(
        'classrooms.enroll_count',
        'classrooms.enroll_classrooms',
        'enroll_classroom',
        qb =>
          qb
            .innerJoin(
              'enrolls',
              'enroll',
              'enroll.id = enroll_classroom.enroll_id',
            )
            .where("enroll.status = 'ACTIVE'")
            .andWhere("enroll_classroom.status = 'ACTIVE'"),
      );

    const multigrades = await queryBuilder.getMany();

    const finalMultigrades = multigrades.map(multigrade => {
      const { multigrade_classrooms = [] } = multigrade;

      const enroll_count = multigrade_classrooms.reduce((acc, item) => {
        const { classroom } = item;
        const count = classroom.enroll_count || 0;

        return acc + count;
      }, 0);

      return Object.assign(multigrade, {
        enroll_count,
        multigrade_classrooms: [],
      });
    });

    return finalMultigrades;
  }
}

export default MultigradesRepository;
