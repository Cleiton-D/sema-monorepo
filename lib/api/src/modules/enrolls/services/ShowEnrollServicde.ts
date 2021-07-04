import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Enroll from '../infra/typeorm/entities/Enroll';
import IEnrollsRepository from '../repositories/IEnrollsRepository';

type ShowEnrollRequest = {
  enroll_id: string;
};

@injectable()
class ShowEnrollService {
  constructor(
    @inject('EnrollsRepository') private enrollsRepository: IEnrollsRepository,
  ) {}

  public async execute({ enroll_id }: ShowEnrollRequest): Promise<Enroll> {
    const enroll = await this.enrollsRepository.findOne({ id: enroll_id });
    if (!enroll) {
      throw new AppError('Enroll not found');
    }

    return enroll;
  }
}

export default ShowEnrollService;
