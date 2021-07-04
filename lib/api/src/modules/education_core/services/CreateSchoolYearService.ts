import { inject, injectable } from 'tsyringe';
import { parseISO } from 'date-fns';

import AppError from '@shared/errors/AppError';

import SchoolYear from '../infra/typeorm/entities/SchoolYear';
import ISchoolYearsRepository from '../repositories/ISchoolYearsRepository';
import ReplicateClassPeriodsService from './ReplicateClassPeriodsService';
import ReplicateGradeSchoolSubjectsService from './ReplicateGradeSchoolSubjectsService';

type CreateSchoolYearRequest = {
  reference_year: string;
  date_start: string;
  date_end: string;
};

type DuplicateSchoolYearConfigsProps = {
  oldSchoolYear: SchoolYear;
  newSchoolYear: SchoolYear;
};
@injectable()
class CreateSchoolYearService {
  constructor(
    @inject('SchoolYearsRepository')
    private schoolYearsRepository: ISchoolYearsRepository,
    private replicateClassPeriodsService: ReplicateClassPeriodsService,
    private replicateGradeSchoolSubjectsService: ReplicateGradeSchoolSubjectsService,
  ) {}

  public async execute({
    reference_year,
    date_start: dateStartStr,
    date_end: dateEndStr,
  }: CreateSchoolYearRequest): Promise<SchoolYear> {
    const existWithReferenceYear = await this.schoolYearsRepository.findByReferenceYear(
      reference_year,
    );
    if (existWithReferenceYear) {
      throw new AppError('Already exist an school year for this year');
    }

    const date_start = parseISO(dateStartStr);
    const date_end = parseISO(dateEndStr);

    const existInPeriod = await this.schoolYearsRepository.findByPeriod({
      date_start,
      date_end,
    });
    if (existInPeriod) {
      throw new AppError('Already exist an school year in the period');
    }

    const lastSchoolYear = await this.schoolYearsRepository.findLast();
    const schoolYear = await this.schoolYearsRepository.create({
      reference_year,
      date_start,
      date_end,
    });

    if (lastSchoolYear) {
      await this.duplicateSchoolYearConfigs({
        oldSchoolYear: lastSchoolYear,
        newSchoolYear: schoolYear,
      });
    }

    return schoolYear;
  }

  private async duplicateSchoolYearConfigs({
    oldSchoolYear,
    newSchoolYear,
  }: DuplicateSchoolYearConfigsProps): Promise<void> {
    await this.replicateClassPeriodsService.execute({
      old_school_year_id: oldSchoolYear.id,
      new_school_year_id: newSchoolYear.id,
    });

    await this.replicateGradeSchoolSubjectsService.execute({
      old_school_year_id: oldSchoolYear.id,
      new_school_year_id: newSchoolYear.id,
    });
  }
}

export default CreateSchoolYearService;
