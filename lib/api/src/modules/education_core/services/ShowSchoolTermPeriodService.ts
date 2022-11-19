import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import SchoolTermPeriod, {
  TermPeriodStatus,
} from '../infra/typeorm/entities/SchoolTermPeriod';
import ISchoolTermPeriodsRepository from '../repositories/ISchoolTermPeriodsRepository';

type ShowSchoolTermPeriodRequest = {
  id?: string;
  school_year_id?: string;
  contain_date?: Date;
  status?: TermPeriodStatus;
};

@injectable()
class ShowSchoolTermPeriodService {
  constructor(
    @inject('SchoolTermPeriodsRepository')
    private schoolTermPeriodsRepository: ISchoolTermPeriodsRepository,
  ) {}

  public async execute({
    id,
    school_year_id,
    contain_date,
    status,
  }: ShowSchoolTermPeriodRequest): Promise<SchoolTermPeriod> {
    const schoolTermPeriod = await this.schoolTermPeriodsRepository.findOne({
      id,
      school_year_id,
      contain_date,
      status,
    });

    if (!schoolTermPeriod) {
      throw new AppError('School Term period not found');
    }

    return schoolTermPeriod;
  }
}

export default ShowSchoolTermPeriodService;
