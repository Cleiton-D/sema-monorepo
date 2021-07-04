import { inject, injectable } from 'tsyringe';

import SchoolClassPeriod from '../infra/typeorm/entities/SchoolClassPeriod';
import ISchoolClassPeriodsRepository from '../repositories/ISchoolClassPeriodsRepository';

type ListSchoolClassPeriodsRequest = {
  school_id: 'all' | string;
  school_year_id?: string;
};

@injectable()
class ListSchoolClassPeriodsService {
  constructor(
    @inject('SchoolClassPeriodsRepository')
    private schoolClassPeriodsRepository: ISchoolClassPeriodsRepository,
  ) {}

  public async execute({
    school_id,
    school_year_id,
  }: ListSchoolClassPeriodsRequest): Promise<SchoolClassPeriod[]> {
    const schoolClassPeriods = await this.schoolClassPeriodsRepository.find({
      school_year_id,
      school_id: school_id !== 'all' ? school_id : undefined,
    });

    return schoolClassPeriods;
  }
}

export default ListSchoolClassPeriodsService;
