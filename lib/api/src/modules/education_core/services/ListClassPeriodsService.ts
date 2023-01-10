import { inject, injectable } from 'tsyringe';

import ClassPeriod from '../infra/typeorm/entities/ClassPeriod';
import IClassPeriodsRepository from '../repositories/IClassPeriodsRepository';

type ListClassPeriodsRequest = {
  school_id?: string;
  school_year_id?: string;
};

@injectable()
class ListClassPeriodsService {
  constructor(
    @inject('ClassPeriodsRepository')
    private classPeriodsRepository: IClassPeriodsRepository,
  ) {}

  public async execute({
    school_id,
    school_year_id,
  }: ListClassPeriodsRequest): Promise<ClassPeriod[]> {
    const classPeriods = await this.classPeriodsRepository.findAll({
      school_id,
      school_year_id,
    });
    return classPeriods;
  }
}

export default ListClassPeriodsService;
