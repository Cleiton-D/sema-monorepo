import { FindOptionsWhere, Repository } from 'typeorm';

import { dataSource } from '@config/data_source';

import IClassPeriodsRepository from '@modules/education_core/repositories/IClassPeriodsRepository';
import CreateClassPeriodDTO from '@modules/education_core/dtos/CreateClassPeriodDTO';

import FindClassPeriodFiltersDTO from '@modules/education_core/dtos/FindClassPeriodFiltersDTO';
import ClassPeriod from '../entities/ClassPeriod';

class ClassPeriodsRepository implements IClassPeriodsRepository {
  private ormRepository: Repository<ClassPeriod>;

  constructor() {
    this.ormRepository = dataSource.getRepository(ClassPeriod);
  }

  public async findOne({
    id,
    school_id,
  }: FindClassPeriodFiltersDTO): Promise<ClassPeriod | undefined> {
    const where: FindOptionsWhere<ClassPeriod> = {};
    if (id) where.id = id;

    const queryBuilder = this.ormRepository
      .createQueryBuilder('class_period')
      .select()
      .where(where);

    if (school_id) {
      queryBuilder.andWhere(
        `EXISTS (
          SELECT 1
            FROM classrooms as classroom
           WHERE classroom.school_id = :schoolId
             AND classroom.class_period_id = class_period.id
        )`,
        { schoolId: school_id },
      );
    }

    const classPeriod = await queryBuilder.getOne();
    return classPeriod ?? undefined;
  }

  public async findAll({
    id,
    school_id,
  }: FindClassPeriodFiltersDTO = {}): Promise<ClassPeriod[]> {
    const where: FindOptionsWhere<ClassPeriod> = {};
    if (id) where.id = id;

    const queryBuilder = this.ormRepository
      .createQueryBuilder('class_period')
      .select()
      .where(where);

    if (school_id) {
      queryBuilder.andWhere(
        `EXISTS (
          SELECT 1
            FROM classrooms as classroom
           WHERE classroom.school_id = :schoolId
             AND classroom.class_period_id = class_period.id
        )`,
        { schoolId: school_id },
      );
    }

    const classPeriods = await queryBuilder.getMany();

    return classPeriods;
  }

  public async createMany(
    data: CreateClassPeriodDTO[],
  ): Promise<ClassPeriod[]> {
    const classPeriods = data.map(
      ({
        description,
        time_start,
        time_end,
        class_time,
        break_time,
        break_time_start,
      }) =>
        this.ormRepository.create({
          description,
          time_start,
          time_end,
          class_time,
          break_time,
          break_time_start,
        }),
    );

    await this.ormRepository.save(classPeriods);
    return classPeriods;
  }

  public async updateMany(classPeriods: ClassPeriod[]): Promise<ClassPeriod[]> {
    await this.ormRepository.save(classPeriods);
    return classPeriods;
  }

  public async delete(classPeriod: ClassPeriod): Promise<void> {
    await this.ormRepository.remove(classPeriod);
  }
}

export default ClassPeriodsRepository;
