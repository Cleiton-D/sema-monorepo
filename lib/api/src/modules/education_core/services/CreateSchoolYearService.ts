import { inject, injectable } from 'tsyringe';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

import AppError from '@shared/errors/AppError';

import SchoolYear from '../infra/typeorm/entities/SchoolYear';
import ISchoolYearsRepository from '../repositories/ISchoolYearsRepository';
import DuplicateClassPeriodsService from './DuplicateClassPeriodsService';
import DuplicateGradesSchoolSubjectsService from './DuplicateGradesSchoolSubjectsService';

type CreateSchoolYearRequest = {
  reference_year: string;
  date_start: string;
  date_end: string;
};

@injectable()
class CreateSchoolYearService {
  constructor(
    @inject('SchoolYearsRepository')
    private schoolYearsRepository: ISchoolYearsRepository,
    private duplicateClassPeriods: DuplicateClassPeriodsService,
    private duplicateGradesSchoolSubjects: DuplicateGradesSchoolSubjectsService,
  ) {}

  public async execute({
    reference_year,
    date_start: dateStartStr,
    date_end: dateEndStr,
  }: CreateSchoolYearRequest): Promise<SchoolYear> {
    const existWithReferenceYear =
      await this.schoolYearsRepository.findByReferenceYear(reference_year);
    if (existWithReferenceYear) {
      throw new AppError('Already exist an school year for this year');
    }

    const date_start = startOfDay(parseISO(dateStartStr));
    const date_end = endOfDay(parseISO(dateEndStr));

    const startOfToday = startOfDay(new Date());

    const existInPeriod = await this.schoolYearsRepository.findByPeriod({
      date_start,
      date_end,
    });
    if (existInPeriod) {
      throw new AppError('Already exist an school year in the period');
    }

    const previousSchoolYear = await this.schoolYearsRepository.findLast();
    const schoolYear = await this.schoolYearsRepository.create({
      reference_year,
      date_start,
      date_end,
      status:
        startOfToday.getTime() >= date_start.getTime() ? 'ACTIVE' : 'PENDING',
    });

    if (!previousSchoolYear) return schoolYear;

    await this.duplicateClassPeriods.execute(previousSchoolYear, schoolYear);
    await this.duplicateGradesSchoolSubjects.execute(
      previousSchoolYear,
      schoolYear,
    );

    return schoolYear;
  }
}

export default CreateSchoolYearService;
