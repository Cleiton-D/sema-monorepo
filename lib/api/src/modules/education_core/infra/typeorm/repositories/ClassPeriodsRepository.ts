import { FindConditions, getRepository, Repository } from 'typeorm';

import IClassPeriodsRepository from '@modules/education_core/repositories/IClassPeriodsRepository';
import CreateClassPeriodDTO from '@modules/education_core/dtos/CreateClassPeriodDTO';

import FindClassPeriodFiltersDTO from '@modules/education_core/dtos/FindClassPeriodFiltersDTO';
import ClassPeriod from '../entities/ClassPeriod';

class ClassPeriodsRepository implements IClassPeriodsRepository {
  private ormRepository: Repository<ClassPeriod>;

  constructor() {
    this.ormRepository = getRepository(ClassPeriod);
  }

  public async findOne({
    id,
    school_year_id,
  }: FindClassPeriodFiltersDTO): Promise<ClassPeriod | undefined> {
    const where: FindConditions<ClassPeriod> = {};
    if (id) where.id = id;
    if (school_year_id) where.school_year_id = school_year_id;

    const classPeriod = await this.ormRepository.findOne({ where });
    return classPeriod;
  }

  public async findBySchoolYear(
    school_year_id: string,
  ): Promise<ClassPeriod[]> {
    const classPeriods = await this.ormRepository.find({
      where: { school_year_id },
    });
    return classPeriods;
  }

  public async findAll({
    id,
    school_year_id,
  }: FindClassPeriodFiltersDTO): Promise<ClassPeriod[]> {
    const where: FindConditions<ClassPeriod> = {};
    if (id) where.id = id;
    if (school_year_id) where.school_year_id = school_year_id;

    const classPeriods = await this.ormRepository.find({ where });
    return classPeriods;
  }

  public async createMany(
    data: CreateClassPeriodDTO[],
  ): Promise<ClassPeriod[]> {
    const classPeriods = data.map(
      ({
        description,
        school_year_id,
        time_start,
        time_end,
        class_time,
        break_time,
        break_time_start,
      }) =>
        this.ormRepository.create({
          description,
          school_year_id,
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
