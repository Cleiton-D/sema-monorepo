import { inject, injectable } from 'tsyringe';

import IClassPeriodsRepository from '../repositories/IClassPeriodsRepository';
import SchoolYear from '../infra/typeorm/entities/SchoolYear';
import ListClassPeriodsService from './ListClassPeriodsService';
import ClassPeriod from '../infra/typeorm/entities/ClassPeriod';

@injectable()
class DuplicateClassPeriodsService {
  constructor(
    @inject('ClassPeriodsRepository')
    private classPeriodsRepository: IClassPeriodsRepository,
    private listClassPeriods: ListClassPeriodsService,
  ) {}

  public async execute(
    fromSchoolYear: SchoolYear,
    toSchoolYear: SchoolYear,
  ): Promise<ClassPeriod[]> {
    const classPeriods = await this.listClassPeriods.execute({
      school_year_id: fromSchoolYear.id,
    });

    const newClassPeriods = classPeriods.map(classPeriod => {
      return {
        school_year_id: toSchoolYear.id,
        description: classPeriod.description,
        time_start: classPeriod.time_start,
        time_end: classPeriod.time_end,
        class_time: classPeriod.class_time,
        break_time: classPeriod.break_time,
        break_time_start: classPeriod.break_time_start,
      };
    });

    return this.classPeriodsRepository.createMany(newClassPeriods);
  }
}

export default DuplicateClassPeriodsService;
