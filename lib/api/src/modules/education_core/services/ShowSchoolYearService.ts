import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import SchoolYear from '../infra/typeorm/entities/SchoolYear';
import ISchoolYearsRepository from '../repositories/ISchoolYearsRepository';

type ShowSchoolYearRequest = {
  school_year_id: string;
};

@injectable()
class ShowSchoolYearService {
  constructor(
    @inject('SchoolYearsRepository')
    private schoolYearsRepository: ISchoolYearsRepository,
  ) {}

  public async execute({
    school_year_id,
  }: ShowSchoolYearRequest): Promise<SchoolYear> {
    if (school_year_id === 'current') {
      const currentSchoolYear = await this.schoolYearsRepository.getCurrent();
      if (!currentSchoolYear) {
        const lastSchoolYear = await this.schoolYearsRepository.findLast();
        if (!lastSchoolYear) throw new AppError('School year not found.');

        return lastSchoolYear;
      }

      return currentSchoolYear;
    }

    const schoolYear = await this.schoolYearsRepository.findById(
      school_year_id,
    );
    if (!schoolYear) {
      throw new AppError('School year not found.');
    }

    return schoolYear;
  }
}

export default ShowSchoolYearService;
