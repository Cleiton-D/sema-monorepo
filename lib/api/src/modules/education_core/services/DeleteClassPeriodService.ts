import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IClassPeriodsRepository from '../repositories/IClassPeriodsRepository';

type DeleteClassPeriodRequest = {
  class_period_id: string;
};

@injectable()
class DeleteClassPeriodService {
  constructor(
    @inject('ClassPeriodsRepository')
    private classPeriodsRepository: IClassPeriodsRepository,
  ) {}

  public async execute({
    class_period_id,
  }: DeleteClassPeriodRequest): Promise<void> {
    const classPeriod = await this.classPeriodsRepository.findOne({
      id: class_period_id,
    });
    if (!classPeriod) {
      throw new AppError('Class period not found.');
    }

    await this.classPeriodsRepository.delete(classPeriod);
  }
}

export default DeleteClassPeriodService;
