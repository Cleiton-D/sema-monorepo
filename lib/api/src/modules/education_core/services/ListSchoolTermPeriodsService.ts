import { inject, injectable } from 'tsyringe';

import SchoolTermPeriod, {
  TermPeriodStatus,
} from '../infra/typeorm/entities/SchoolTermPeriod';
import ISchoolTermPeriodsRepository from '../repositories/ISchoolTermPeriodsRepository';

type ListSchoolTermPeriodsRequest = {
  school_year_id?: string;
  status?: TermPeriodStatus | TermPeriodStatus[];
};

@injectable()
class ListSchoolTermPeriodsService {
  constructor(
    @inject('SchoolTermPeriodsRepository')
    private schoolTermPeriodsRepository: ISchoolTermPeriodsRepository,
  ) {}

  public async execute({
    school_year_id,
    status,
  }: ListSchoolTermPeriodsRequest): Promise<SchoolTermPeriod[]> {
    const schoolTermPeriods = await this.schoolTermPeriodsRepository.findAll({
      school_year_id,
      status,
    });

    return schoolTermPeriods;
  }
}

export default ListSchoolTermPeriodsService;
