import { inject, injectable } from 'tsyringe';

import ClassPeriod from '../infra/typeorm/entities/ClassPeriod';
import IClassPeriodsRepository from '../repositories/IClassPeriodsRepository';

@injectable()
class ListClassPeriodsService {
  constructor(
    @inject('ClassPeriodsRepository')
    private classPeriodsRepository: IClassPeriodsRepository,
  ) {}

  public async execute(): Promise<ClassPeriod[]> {
    const classPeriods = await this.classPeriodsRepository.findAll();
    return classPeriods;
  }
}

export default ListClassPeriodsService;
