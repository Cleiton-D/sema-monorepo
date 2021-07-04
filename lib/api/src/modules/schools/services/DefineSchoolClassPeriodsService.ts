import { inject, injectable } from 'tsyringe';

import { ClassPeriodType } from '@modules/education_core/infra/typeorm/entities/ClassPeriod';
import IClassPeriodsRepository from '@modules/education_core/repositories/IClassPeriodsRepository';

import AppError from '@shared/errors/AppError';

import SchoolClassPeriod from '../infra/typeorm/entities/SchoolClassPeriod';
import ISchoolClassPeriodsRepository from '../repositories/ISchoolClassPeriodsRepository';
import ISchoolsRepository from '../repositories/ISchoolsRepository';
import CreateSchoolClassPeriodDTO from '../dtos/CreateSchoolClassPeriodDTO';

type DefineSchoolClassPeriodsRequest = {
  school_year_id: string;
  school_id: string;
  class_periods: ClassPeriodType[];
};

type MappedUpdateAndCreateClassPeriods = {
  newItems: CreateSchoolClassPeriodDTO[];
  updateItems: SchoolClassPeriod[];
};

@injectable()
class DefineSchoolClassPeriodsService {
  constructor(
    @inject('SchoolClassPeriodsRepository')
    private schoolClassPeriodsRepository: ISchoolClassPeriodsRepository,
    @inject('ClassPeriodsRepository')
    private classPeriodsRepository: IClassPeriodsRepository,
    @inject('SchoolsRepository') private schoolsRepository: ISchoolsRepository,
  ) {}

  public async execute({
    school_year_id,
    school_id,
    class_periods,
  }: DefineSchoolClassPeriodsRequest): Promise<SchoolClassPeriod[]> {
    const school = await this.schoolsRepository.findOne({ id: school_id });
    if (!school) {
      throw new AppError('School not found');
    }

    // remove elementos repetidos
    const filteredClassPeriods = [...new Set(class_periods)];

    const [currentClassPeriods, currentSchoolClassPeriods] = await Promise.all([
      this.classPeriodsRepository.findBySchoolYear(school_year_id),
      this.schoolClassPeriodsRepository.find({ school_id, school_year_id }),
    ]);

    const hasInexistentPeriod = filteredClassPeriods.some(
      item => !currentClassPeriods.find(p => p.description === item),
    );
    if (hasInexistentPeriod) {
      throw new AppError('one of the periods does not exist');
    }

    const classPeriods = currentClassPeriods.filter(item =>
      filteredClassPeriods.includes(item.description),
    );

    const deleteItems = currentSchoolClassPeriods.filter(
      item => !filteredClassPeriods.includes(item.class_period.description),
    );

    const {
      newItems,
      updateItems,
    } = classPeriods.reduce<MappedUpdateAndCreateClassPeriods>(
      (acc, item) => {
        const { newItems: nwItems, updateItems: uptItems } = acc;

        const existentSchoolClassPeriod = currentSchoolClassPeriods.find(
          schoolClassPeriod => schoolClassPeriod.class_period_id === item.id,
        );

        if (existentSchoolClassPeriod) {
          const newClassPeriod = Object.assign(existentSchoolClassPeriod, {
            class_period: item,
            class_period_id: item.id,
          });
          uptItems.push(newClassPeriod);
        } else {
          nwItems.push({
            class_period_id: item.id,
            school_id,
            school_year_id,
          });
        }

        return { newItems: nwItems, updateItems: uptItems };
      },
      {
        newItems: [],
        updateItems: [],
      },
    );

    const [createdItems, updatedItems] = await Promise.all([
      this.schoolClassPeriodsRepository.createMany(newItems),
      this.schoolClassPeriodsRepository.updateMany(updateItems),
      this.schoolClassPeriodsRepository.deleteMany(deleteItems),
    ]);

    return [...createdItems, ...updatedItems];
  }
}

export default DefineSchoolClassPeriodsService;
