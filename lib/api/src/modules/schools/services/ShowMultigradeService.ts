import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Multigrade from '../infra/typeorm/entities/Multigrade';
import IMultigradesRepository from '../repositories/IMultigradesRepository';

type ShowMultigradeRequest = {
  multigrade_id: string;
};

@injectable()
class ShowMultigradeService {
  constructor(
    @inject('MultigradesRepository')
    private multigradesRepository: IMultigradesRepository,
  ) {}

  public async execute({
    multigrade_id,
  }: ShowMultigradeRequest): Promise<Multigrade> {
    const multigrade = await this.multigradesRepository.findOne({
      id: multigrade_id,
    });
    if (!multigrade) {
      throw new AppError('Multigrade not found');
    }

    return multigrade;
  }
}

export default ShowMultigradeService;
