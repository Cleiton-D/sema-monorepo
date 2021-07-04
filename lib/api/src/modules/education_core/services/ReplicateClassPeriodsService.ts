import { inject, injectable } from 'tsyringe';

import ReplicateSchoolClassPeriodsService from '@modules/schools/services/ReplicateSchoolClassPeriodsService';

import ClassPeriod from '../infra/typeorm/entities/ClassPeriod';
import IClassPeriodsRepository from '../repositories/IClassPeriodsRepository';

type ReplicateClassPeriodsRequest = {
  old_school_year_id: string;
  new_school_year_id: string;
};

@injectable()
class ReplicateClassPeriodsService {
  constructor(
    @inject('ClassPeriodsRepository')
    private classPeriodsRepository: IClassPeriodsRepository,
    private replicateSchoolClassPeriodsService: ReplicateSchoolClassPeriodsService,
  ) {}

  public async execute({
    old_school_year_id,
    new_school_year_id,
  }: ReplicateClassPeriodsRequest): Promise<ClassPeriod[]> {
    const classPeriods = await this.classPeriodsRepository.findBySchoolYear(
      old_school_year_id,
    );

    const newClassPeriodsData = classPeriods.map(
      ({
        description,
        time_start,
        time_end,
        class_time,
        break_time,
        break_time_start,
      }) => ({
        school_year_id: new_school_year_id,
        description,
        time_start,
        time_end,
        class_time,
        break_time,
        break_time_start,
      }),
    );

    const newClassPeriods = await this.classPeriodsRepository.createMany(
      newClassPeriodsData,
    );

    await this.replicateSchoolClassPeriodsService.execute({
      old_class_periods: classPeriods,
      new_class_periods: newClassPeriods,
      school_year_id: new_school_year_id,
    });

    return newClassPeriods;
  }
}

export default ReplicateClassPeriodsService;
