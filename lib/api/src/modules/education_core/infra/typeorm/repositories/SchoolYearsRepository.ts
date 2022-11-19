import { FindOptionsWhere, Raw, Repository, In } from 'typeorm';

import { dataSource } from '@config/data_source';

import ISchoolYearsRepository from '@modules/education_core/repositories/ISchoolYearsRepository';
import FindSchollYearByPeriodDTO from '@modules/education_core/dtos/FindSchollYearByPeriodDTO';

import CreateSchoolYearDTO from '@modules/education_core/dtos/CreateSchoolYearDTO';
import FindSchoolYearsDTO from '@modules/education_core/dtos/FindSchoolYearsDTO';
import SchoolYear from '../entities/SchoolYear';

class SchoolYearsRepository implements ISchoolYearsRepository {
  private ormRepository: Repository<SchoolYear>;

  constructor() {
    this.ormRepository = dataSource.getRepository(SchoolYear);
  }

  public async findById(
    school_year_id: string,
  ): Promise<SchoolYear | undefined> {
    const school_year = await this.ormRepository.findOne({
      where: { id: school_year_id },
    });
    return school_year ?? undefined;
  }

  public async findByReferenceYear(
    reference_year: string,
  ): Promise<SchoolYear | undefined> {
    const schoolYear = await this.ormRepository.findOne({
      where: { reference_year },
    });
    return schoolYear ?? undefined;
  }

  public async findByPeriod({
    date_start,
    date_end,
  }: FindSchollYearByPeriodDTO): Promise<SchoolYear | undefined> {
    const dayStart = date_start.getDate();
    const monthStart = date_start.getMonth() + 1;
    const yearStart = date_start.getFullYear();

    const dayEnd = date_end.getDate();
    const monthEnd = date_end.getMonth() + 1;
    const yearEnd = date_end.getFullYear();

    const dayStartStr = String(dayStart).padStart(2, '0');
    const monthStartStr = String(monthStart).padStart(2, '0');

    const dayEndStr = String(dayEnd).padStart(2, '0');
    const monthEndStr = String(monthEnd).padStart(2, '0');

    const schoolYear = await this.ormRepository.findOne({
      where: [
        {
          date_start: Raw(
            field =>
              `${field} <= TO_DATE('${dayStartStr}-${monthStartStr}-${yearStart}', 'DD-MM-YYYY')`,
          ),
          date_end: Raw(
            field =>
              `${field} >= TO_DATE('${dayStartStr}-${monthStartStr}-${yearStart}', 'DD-MM-YYYY')`,
          ),
        },
        {
          date_start: Raw(
            field =>
              `${field} <= TO_DATE('${dayEndStr}-${monthEndStr}-${yearEnd}', 'DD-MM-YYYY')`,
          ),
          date_end: Raw(
            field =>
              `${field} >= TO_DATE('${dayEndStr}-${monthEndStr}-${yearEnd}', 'DD-MM-YYYY')`,
          ),
        },
        {
          date_start: Raw(
            field =>
              `${field} >= TO_DATE('${dayStartStr}-${monthStartStr}-${yearStart}', 'DD-MM-YYYY')`,
          ),
          date_end: Raw(
            field =>
              `${field} <= TO_DATE('${dayEndStr}-${monthEndStr}-${yearEnd}', 'DD-MM-YYYY')`,
          ),
        },
      ],
    });

    return schoolYear ?? undefined;
  }

  public async findLast(): Promise<SchoolYear | undefined> {
    const queryBuilder = this.ormRepository
      .createQueryBuilder('school_year')
      .select()
      .orderBy({ created_at: 'DESC' });

    const schoolYear = await queryBuilder.getOne();

    return schoolYear ?? undefined;
  }

  public async getCurrent(): Promise<SchoolYear | undefined> {
    const schoolYear = await this.ormRepository.findOne({
      where: {
        status: 'ACTIVE',
      },
    });

    return schoolYear ?? undefined;
  }

  public async findAll({ status }: FindSchoolYearsDTO): Promise<SchoolYear[]> {
    const where: FindOptionsWhere<SchoolYear> = {};

    if (status) {
      if (Array.isArray(status)) {
        where.status = In(status);
      } else {
        where.status = status;
      }
    }

    const schoolYears = await this.ormRepository.find({
      where,
    });
    return schoolYears;
  }

  public async create({
    reference_year,
    date_start,
    date_end,
  }: CreateSchoolYearDTO): Promise<SchoolYear> {
    const schoolYear = this.ormRepository.create({
      reference_year,
      date_start,
      date_end,
    });

    await this.ormRepository.save(schoolYear);
    return schoolYear;
  }

  public async update(schoolYear: SchoolYear): Promise<SchoolYear> {
    await this.ormRepository.save(schoolYear);
    return schoolYear;
  }

  public async updateMany(schoolYears: SchoolYear[]): Promise<SchoolYear[]> {
    await this.ormRepository.save(schoolYears);
    return schoolYears;
  }
}

export default SchoolYearsRepository;
