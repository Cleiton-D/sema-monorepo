import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import SchoolTermPeriod, {
  TermPeriodStatus,
} from '../infra/typeorm/entities/SchoolTermPeriod';
import ISchoolTermPeriodsRepository from '../repositories/ISchoolTermPeriodsRepository';

type ShowSchoolTermPeriodRequest = {
  school_year_id?: string;
  status?: TermPeriodStatus;
};

@injectable()
class ShowSchoolTermPeriodService {
  constructor(
    @inject('SchoolTermPeriodsRepository')
    private schoolTermPeriodsRepository: ISchoolTermPeriodsRepository,
  ) {}

  public async execute({
    school_year_id,
    status,
  }: ShowSchoolTermPeriodRequest): Promise<SchoolTermPeriod> {
    const schoolTermPeriod = await this.schoolTermPeriodsRepository.findOne({
      school_year_id,
      status,
    });

    if (!schoolTermPeriod) {
      throw new AppError('School Term period not found');
    }

    return schoolTermPeriod;
  }
}

export default ShowSchoolTermPeriodService;
