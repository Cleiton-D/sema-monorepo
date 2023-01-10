import { inject, injectable } from 'tsyringe';

import ClassPeriod from '../infra/typeorm/entities/ClassPeriod';

import IClassPeriodsRepository from '../repositories/IClassPeriodsRepository';
import CreateClassPeriodDTO from '../dtos/CreateClassPeriodDTO';

type DefineClassPeriodRequest = {
  school_year_id: string;
  class_periods: Record<
    string,
    {
      time_start: string;
      time_end: string;
      class_time: string;
      break_time: string;
      break_time_start: string;
      school_year_id: string;
    }
  >;
};

type MappedUpdateAndCreateClassPeriods = {
  newItems: CreateClassPeriodDTO[];
  updateItems: ClassPeriod[];
};

@injectable()
class DefineClassPeriodsService {
  constructor(
    @inject('ClassPeriodsRepository')
    private classPeriodsRepository: IClassPeriodsRepository,
  ) {}

  public async execute({
    class_periods,
    school_year_id,
  }: DefineClassPeriodRequest): Promise<ClassPeriod[]> {
    const existentClassPeriods = await this.classPeriodsRepository.findAll({
      school_year_id,
    });

    const { newItems, updateItems } = Object.entries(
      class_periods,
    ).reduce<MappedUpdateAndCreateClassPeriods>(
      (acc, [key, value]) => {
        const {
          time_start,
          time_end,
          class_time,
          break_time,
          break_time_start,
        } = value;

        const { newItems: nwItems, updateItems: upItems } = acc;

        const classPeriod = existentClassPeriods.find(existentClassPeriod => {
          return (
            existentClassPeriod.description.toLowerCase() === key.toLowerCase()
          );
        });
        if (classPeriod) {
          const newClassPeriod = Object.assign(classPeriod, {
            time_start,
            time_end,
            class_time,
            break_time,
            break_time_start,
            school_year_id,
          });
          upItems.push(newClassPeriod);
        } else {
          nwItems.push({
            description: key,
            time_start,
            time_end,
            class_time,
            break_time,
            break_time_start,
            school_year_id,
          });
        }

        return { newItems: nwItems, updateItems: upItems };
      },
      {
        newItems: [],
        updateItems: [],
      },
    );

    const [createdClassPeriods, updatedClassPeriods] = await Promise.all([
      this.classPeriodsRepository.createMany(newItems),
      this.classPeriodsRepository.updateMany(updateItems),
    ]);

    return [...createdClassPeriods, ...updatedClassPeriods];
  }
}

export default DefineClassPeriodsService;
