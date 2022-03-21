import { FindConditions, getRepository, Repository } from 'typeorm';

import ISchoolTermPeriodsRepository from '@modules/education_core/repositories/ISchoolTermPeriodsRepository';
import FindSchoolTermPeriodDTO from '@modules/education_core/dtos/FindSchoolTermPeriodDTO';
import CreateSchoolTermPeriodDTO from '@modules/education_core/dtos/CreateSchoolTermPeriodDTO';

import SchoolTermPeriod from '../entities/SchoolTermPeriod';

class SchoolTermPeriodsRepository implements ISchoolTermPeriodsRepository {
  private ormRepository: Repository<SchoolTermPeriod>;

  constructor() {
    this.ormRepository = getRepository(SchoolTermPeriod);
  }

  public async findOne({
    id,
    school_year_id,
    status,
  }: FindSchoolTermPeriodDTO): Promise<SchoolTermPeriod | undefined> {
    const where: FindConditions<SchoolTermPeriod> = {};
    if (id) where.id = id;
    if (school_year_id) {
      where.school_year_id = school_year_id;
    }
    if (status) {
      where.status = status;
    }

    const schoolTermPeriods = await this.ormRepository.findOne({
      where,
    });

    return schoolTermPeriods;
  }

  public async findAll({
    school_year_id,
    status,
  }: FindSchoolTermPeriodDTO): Promise<SchoolTermPeriod[]> {
    const where: FindConditions<SchoolTermPeriod> = {};
    if (school_year_id) {
      where.school_year_id = school_year_id;
    }
    if (status) {
      where.status = status;
    }

    const schoolTermPeriods = await this.ormRepository.find({
      where,
    });

    return schoolTermPeriods;
  }

  public async createMany(
    items: CreateSchoolTermPeriodDTO[],
  ): Promise<SchoolTermPeriod[]> {
    const schoolTermPeriods = items.map(
      ({ school_year_id, school_term, date_start, date_end }) =>
        this.ormRepository.create({
          school_year_id,
          school_term,
          date_start,
          date_end,
        }),
    );

    await this.ormRepository.save(schoolTermPeriods);
    return schoolTermPeriods;
  }

  public async updateMany(
    items: SchoolTermPeriod[],
  ): Promise<SchoolTermPeriod[]> {
    await this.ormRepository.save(items);
    return items;
  }
}

export default SchoolTermPeriodsRepository;
