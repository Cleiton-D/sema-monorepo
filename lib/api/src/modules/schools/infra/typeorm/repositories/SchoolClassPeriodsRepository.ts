import { FindConditions, getRepository, Repository, In } from 'typeorm';

import ISchoolClassPeriodsRepository from '@modules/schools/repositories/ISchoolClassPeriodsRepository';
import FindSchoolClassPeriodDTO from '@modules/schools/dtos/FindSchoolClassPeriodDTO';
import CreateSchoolClassPeriodDTO from '@modules/schools/dtos/CreateSchoolClassPeriodDTO';
import GetSchoolClassPeriodDTO from '@modules/schools/dtos/GetSchoolClassPeriodDTO';
import SchoolClassPeriod from '../entities/SchoolClassPeriod';

class SchoolClassPeriodsRepository implements ISchoolClassPeriodsRepository {
  private ormRepository: Repository<SchoolClassPeriod>;

  constructor() {
    this.ormRepository = getRepository(SchoolClassPeriod);
  }

  public async find({
    school_id,
    class_period_id,
    school_year_id,
  }: FindSchoolClassPeriodDTO): Promise<SchoolClassPeriod[]> {
    const where: FindConditions<SchoolClassPeriod> = {};

    if (school_id) where.school_id = school_id;
    if (school_year_id) where.school_year_id = school_year_id;
    if (class_period_id) {
      if (Array.isArray(class_period_id)) {
        where.class_period_id = In(class_period_id);
      } else {
        where.class_period_id = class_period_id;
      }
    }

    const schoolClassPeriods = await this.ormRepository.find({
      where,
      relations: ['class_period'],
    });

    return schoolClassPeriods;
  }

  public async getOne({
    school_id,
    class_period_id,
    period,
    school_year_id,
  }: GetSchoolClassPeriodDTO): Promise<SchoolClassPeriod | undefined> {
    const queryBuilder = this.ormRepository
      .createQueryBuilder('school_class_period')
      .innerJoinAndSelect('school_class_period.class_period', 'class_period');

    if (school_id) {
      queryBuilder.andWhere('school_class_period.school_id = :schoolId', {
        schoolId: school_id,
      });
    }
    if (school_year_id) {
      queryBuilder.andWhere(
        'school_class_period.school_year_id = :schoolYearId',
        {
          schoolYearId: school_year_id,
        },
      );
    }
    if (class_period_id) {
      queryBuilder.andWhere('class_period.id = :classPeriodId', {
        classPeriodId: class_period_id,
      });
    }
    if (period) {
      queryBuilder.andWhere('class_period.description = :period', { period });
    }

    const schoolClassPeriod = await queryBuilder.getOne();
    return schoolClassPeriod;
  }

  public async createMany(
    data: CreateSchoolClassPeriodDTO[],
  ): Promise<SchoolClassPeriod[]> {
    const schoolClassPeriods = data.map(
      ({ school_id, school_year_id, class_period_id }) =>
        this.ormRepository.create({
          school_id,
          school_year_id,
          class_period_id,
        }),
    );

    await this.ormRepository.save(schoolClassPeriods);
    return schoolClassPeriods;
  }

  public async updateMany(
    schoolClassPeriods: SchoolClassPeriod[],
  ): Promise<SchoolClassPeriod[]> {
    await this.ormRepository.save(schoolClassPeriods);
    return schoolClassPeriods;
  }

  public async deleteMany(
    schoolClassPeriods: SchoolClassPeriod[],
  ): Promise<void> {
    await this.ormRepository.remove(schoolClassPeriods);
  }
}

export default SchoolClassPeriodsRepository;
