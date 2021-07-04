import { inject, injectable } from 'tsyringe';

import ClassPeriod from '@modules/education_core/infra/typeorm/entities/ClassPeriod';

import CreateSchoolClassPeriodDTO from '../dtos/CreateSchoolClassPeriodDTO';
import SchoolClassPeriod from '../infra/typeorm/entities/SchoolClassPeriod';
import ISchoolClassPeriodsRepository from '../repositories/ISchoolClassPeriodsRepository';

type ReplicateSchoolClassPeriodsRequest = {
  old_class_periods: ClassPeriod[];
  new_class_periods: ClassPeriod[];
  school_year_id: string;
};

@injectable()
class ReplicateSchoolClassPeriodsService {
  constructor(
    @inject('SchoolClassPeriodsRepository')
    private schoolClassPeriodsRepository: ISchoolClassPeriodsRepository,
  ) {}

  public async execute({
    old_class_periods,
    new_class_periods,
    school_year_id,
  }: ReplicateSchoolClassPeriodsRequest): Promise<SchoolClassPeriod[]> {
    const oldClassPeriodsIds = old_class_periods.map(({ id }) => id);
    const schoolClassPeriods = await this.schoolClassPeriodsRepository.find({
      class_period_id: oldClassPeriodsIds,
    });

    const newSchoolClassPeriodsData = schoolClassPeriods.reduce<
      CreateSchoolClassPeriodDTO[]
    >((acc, item) => {
      const classPeriod = new_class_periods.find(
        ({ description }) => description === item.class_period.description,
      );
      if (!classPeriod) return acc;

      const createSchoolClassPeriodObj = {
        school_id: item.school_id,
        school_year_id,
        class_period_id: classPeriod.id,
      };

      return [...acc, createSchoolClassPeriodObj];
    }, []);

    const newSchoolClassPeriods = await this.schoolClassPeriodsRepository.createMany(
      newSchoolClassPeriodsData,
    );
    return newSchoolClassPeriods;
  }
}

export default ReplicateSchoolClassPeriodsService;
