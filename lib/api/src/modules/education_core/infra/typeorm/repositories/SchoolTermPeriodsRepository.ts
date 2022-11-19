import { FindOptionsWhere, Repository, In, Raw } from 'typeorm';

import { dataSource } from '@config/data_source';

import ISchoolTermPeriodsRepository from '@modules/education_core/repositories/ISchoolTermPeriodsRepository';
import FindSchoolTermPeriodDTO from '@modules/education_core/dtos/FindSchoolTermPeriodDTO';
import CreateSchoolTermPeriodDTO from '@modules/education_core/dtos/CreateSchoolTermPeriodDTO';

import SchoolTermPeriod from '../entities/SchoolTermPeriod';

class SchoolTermPeriodsRepository implements ISchoolTermPeriodsRepository {
  private ormRepository: Repository<SchoolTermPeriod>;

  constructor() {
    this.ormRepository = dataSource.getRepository(SchoolTermPeriod);
  }

  public async findOne({
    id,
    school_year_id,
    contain_date,
    status,
  }: FindSchoolTermPeriodDTO): Promise<SchoolTermPeriod | undefined> {
    const where: FindOptionsWhere<SchoolTermPeriod> = {};
    if (id) where.id = id;
    if (school_year_id) {
      where.school_year_id = school_year_id;
    }
    if (contain_date) {
      const year = contain_date.getFullYear();
      const month = contain_date.getMonth() + 1;
      const day = contain_date.getDate();

      const dateStr = `${year}-${month}-${day}`;

      where.date_start = Raw(
        alias => `CAST(${alias} AS DATE) <= :containDate`,
        { containDate: dateStr },
      );
      where.date_end = Raw(alias => `CAST(${alias} AS DATE) >= :containDate`, {
        containDate: dateStr,
      });
    }

    if (status) {
      if (Array.isArray(status)) {
        where.status = In(status);
      } else {
        where.status = status;
      }
    }

    const schoolTermPeriods = await this.ormRepository.findOne({
      where,
    });

    return schoolTermPeriods ?? undefined;
  }

  public async findAll({
    school_year_id,
    status,
  }: FindSchoolTermPeriodDTO): Promise<SchoolTermPeriod[]> {
    const where: FindOptionsWhere<SchoolTermPeriod> = {};
    if (school_year_id) {
      where.school_year_id = school_year_id;
    }
    if (status) {
      if (Array.isArray(status)) {
        where.status = In(status);
      } else {
        where.status = status;
      }
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
