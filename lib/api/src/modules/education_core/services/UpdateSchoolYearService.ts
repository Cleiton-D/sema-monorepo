import { inject, injectable } from 'tsyringe';
import { parseISO } from 'date-fns';

import AppError from '@shared/errors/AppError';

import SchoolYear from '../infra/typeorm/entities/SchoolYear';
import ISchoolYearsRepository from '../repositories/ISchoolYearsRepository';

type UpdateSchoolYearRequest = {
  school_year_id: string;
  reference_year: string;
  date_start: string;
  date_end: string;
};

@injectable()
class UpdateSchoolYearService {
  constructor(
    @inject('SchoolYearsRepository')
    private schoolYearsRepository: ISchoolYearsRepository,
  ) {}

  public async execute({
    school_year_id,
    reference_year,
    date_start: dateStartStr,
    date_end: dateEndStr,
  }: UpdateSchoolYearRequest): Promise<SchoolYear> {
    const schoolYear = await this.schoolYearsRepository.findById(
      school_year_id,
    );
    if (!schoolYear) {
      throw new AppError('School Year not found.');
    }

    const existWithReferenceYear = await this.schoolYearsRepository.findByReferenceYear(
      reference_year,
    );
    if (
      existWithReferenceYear &&
      existWithReferenceYear.id !== school_year_id
    ) {
      throw new AppError('Already exist an school year for this year');
    }

    const date_start = parseISO(dateStartStr);
    const date_end = parseISO(dateEndStr);

    const existInPeriod = await this.schoolYearsRepository.findByPeriod({
      date_start,
      date_end,
    });
    if (existInPeriod && existInPeriod.id !== school_year_id) {
      throw new AppError('Already exist an school year in the period');
    }

    const newSchoolYear = Object.assign(schoolYear, {
      reference_year,
      date_start,
      date_end,
    });

    return this.schoolYearsRepository.update(newSchoolYear);
  }
}

export default UpdateSchoolYearService;
