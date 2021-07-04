import { getRepository, Raw, Repository } from 'typeorm';

import ISchoolYearsRepository from '@modules/education_core/repositories/ISchoolYearsRepository';
import FindSchollYearByPeriodDTO from '@modules/education_core/dtos/FindSchollYearByPeriodDTO';

import CreateSchoolYearDTO from '@modules/education_core/dtos/CreateSchoolYearDTO';
import SchoolYear from '../entities/SchoolYear';

class SchoolYearsRepository implements ISchoolYearsRepository {
  private ormRepository: Repository<SchoolYear>;

  constructor() {
    this.ormRepository = getRepository(SchoolYear);
  }

  public async findById(
    school_year_id: string,
  ): Promise<SchoolYear | undefined> {
    const school_year = await this.ormRepository.findOne(school_year_id);
    return school_year;
  }

  public async findByReferenceYear(
    reference_year: string,
  ): Promise<SchoolYear | undefined> {
    const schoolYear = await this.ormRepository.findOne({ reference_year });
    return schoolYear;
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

    return schoolYear;
  }

  public async findLast(): Promise<SchoolYear | undefined> {
    const schoolYear = await this.ormRepository.findOne({
      order: { created_at: 'DESC' },
    });

    return schoolYear;
  }

  public async getCurrent(): Promise<SchoolYear | undefined> {
    const schoolYear = await this.ormRepository.findOne({
      where: {
        status: 'ACTIVE',
      },
    });

    return schoolYear;
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
}

export default SchoolYearsRepository;
