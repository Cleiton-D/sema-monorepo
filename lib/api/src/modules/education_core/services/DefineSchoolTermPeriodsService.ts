import { inject, injectable } from 'tsyringe';
import { parseISO } from 'date-fns';

import AppError from '@shared/errors/AppError';
import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';

import SchoolTermPeriod from '../infra/typeorm/entities/SchoolTermPeriod';
import ISchoolTermPeriodsRepository from '../repositories/ISchoolTermPeriodsRepository';
import ISchoolYearsRepository from '../repositories/ISchoolYearsRepository';
import CreateSchoolTermPeriodDTO from '../dtos/CreateSchoolTermPeriodDTO';

type TermPeriod = {
  school_term: SchoolTerm;
  date_start: string;
  date_end: string;
};

type CreateSchoolTermPeriodsRequest = {
  school_year_id: string;
  term_periods: TermPeriod[];
};

type MappedUpdateAndCreateTermPeriods = {
  newItems: CreateSchoolTermPeriodDTO[];
  updateItems: SchoolTermPeriod[];
};

@injectable()
class DefineSchoolTermPeriodsService {
  constructor(
    @inject('SchoolYearsRepository')
    private schoolYearsRepository: ISchoolYearsRepository,
    @inject('SchoolTermPeriodsRepository')
    private schoolTermPeriodsRepository: ISchoolTermPeriodsRepository,
  ) {}

  public async execute({
    school_year_id,
    term_periods,
  }: CreateSchoolTermPeriodsRequest): Promise<SchoolTermPeriod[]> {
    const schoolYear = await this.schoolYearsRepository.findById(
      school_year_id,
    );

    if (!schoolYear) {
      throw new AppError('School Year not found');
    }

    const termPeriodsWithSchoolYear = term_periods.map(
      ({ school_term, date_start, date_end }) => {
        const parsedDateStart = parseISO(date_start);
        const parsedDateEnd = parseISO(date_end);

        return {
          school_term,
          date_start: parsedDateStart,
          date_end: parsedDateEnd,
          school_year_id,
        };
      },
    );

    const existentTermPeriods = await this.schoolTermPeriodsRepository.findAll({
      school_year_id,
    });

    const {
      newItems,
      updateItems,
    } = termPeriodsWithSchoolYear.reduce<MappedUpdateAndCreateTermPeriods>(
      (acc, item) => {
        const {
          date_start,
          date_end,
          school_term,
          school_year_id: school_year,
        } = item;

        const { newItems: nwItems, updateItems: upItems } = acc;

        const termPeriod = existentTermPeriods.find(
          existentTermPeriod => existentTermPeriod.school_term === school_term,
        );
        if (termPeriod) {
          const newTermPeriod = Object.assign(termPeriod, {
            date_start,
            date_end,
            school_term,
            school_year_id: school_year,
          });
          upItems.push(newTermPeriod);
        } else {
          nwItems.push({
            date_start,
            date_end,
            school_term,
            school_year_id: school_year,
          });
        }

        return { newItems: nwItems, updateItems: upItems };
      },

      { newItems: [], updateItems: [] },
    );

    const [createdTermPeriods, updatedTermPeriods] = await Promise.all([
      this.schoolTermPeriodsRepository.createMany(newItems),
      this.schoolTermPeriodsRepository.updateMany(updateItems),
    ]);

    return [...createdTermPeriods, ...updatedTermPeriods];
  }
}

export default DefineSchoolTermPeriodsService;
