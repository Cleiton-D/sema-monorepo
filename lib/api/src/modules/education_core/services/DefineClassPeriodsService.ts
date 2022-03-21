import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ClassPeriod, {
  ClassPeriodType,
} from '../infra/typeorm/entities/ClassPeriod';

import IClassPeriodsRepository from '../repositories/IClassPeriodsRepository';
import ISchoolYearsRepository from '../repositories/ISchoolYearsRepository';
import CreateClassPeriodDTO from '../dtos/CreateClassPeriodDTO';

type DefineClassPeriodRequest = {
  [k in ClassPeriodType]: {
    time_start: string;
    time_end: string;
    class_time: string;
    break_time: string;
    break_time_start: string;
  };
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
    @inject('SchoolYearsRepository')
    private schoolYearsRepository: ISchoolYearsRepository,
  ) {}

  public async execute(
    periods: DefineClassPeriodRequest,
  ): Promise<ClassPeriod[]> {
    const hasInvalidPeriod = Object.keys(periods).some(
      period => !['MORNING', 'EVENING', 'NOCTURNAL'].includes(period),
    );
    if (hasInvalidPeriod) {
      throw new AppError('invalid period');
    }

    const existentClassPeriods = await this.classPeriodsRepository.findAll();

    const { newItems, updateItems } = Object.entries(
      periods,
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

        const classPeriod = existentClassPeriods.find(
          existentClassPeriod => existentClassPeriod.description === key,
        );
        if (classPeriod) {
          const newClassPeriod = Object.assign(classPeriod, {
            time_start,
            time_end,
            class_time,
            break_time,
            break_time_start,
          });
          upItems.push(newClassPeriod);
        } else {
          nwItems.push({
            description: key as ClassPeriodType,
            time_start,
            time_end,
            class_time,
            break_time,
            break_time_start,
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
