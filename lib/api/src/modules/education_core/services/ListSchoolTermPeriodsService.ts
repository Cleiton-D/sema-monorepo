import { inject, injectable } from 'tsyringe';

import SchoolTermPeriod from '../infra/typeorm/entities/SchoolTermPeriod';
import ISchoolTermPeriodsRepository from '../repositories/ISchoolTermPeriodsRepository';

type ListSchoolTermPeriodsRequest = {
  school_year_id?: string;
};

@injectable()
class ListSchoolTermPeriodsService {
  constructor(
    @inject('SchoolTermPeriodsRepository')
    private schoolTermPeriodsRepository: ISchoolTermPeriodsRepository,
  ) {}

  public async execute({
    school_year_id,
  }: ListSchoolTermPeriodsRequest): Promise<SchoolTermPeriod[]> {
    const schoolTermPeriods = await this.schoolTermPeriodsRepository.findAll({
      school_year_id,
    });

    return schoolTermPeriods;
  }
}

export default ListSchoolTermPeriodsService;
