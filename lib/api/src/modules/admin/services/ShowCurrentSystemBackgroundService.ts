import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import SystemBackground from '../infra/typeorm/entities/SystemBackground';
import ISystemBackgroundsRepository from '../repositories/ISystemBackgroundsRepository';

@injectable()
class ShowCurrentSystemBackgroundService {
  constructor(
    @inject('SystemBackgroundsRepository')
    private systemBackgroundsRepository: ISystemBackgroundsRepository,
  ) {}

  public async execute(): Promise<SystemBackground> {
    const systemBackground = await this.systemBackgroundsRepository.findOne({
      current_defined: true,
    });

    if (!systemBackground) {
      throw new AppError('current system background not found');
    }

    return systemBackground;
  }
}

export default ShowCurrentSystemBackgroundService;
