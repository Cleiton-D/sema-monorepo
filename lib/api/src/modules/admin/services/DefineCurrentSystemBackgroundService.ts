import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import SystemBackground from '../infra/typeorm/entities/SystemBackground';
import ISystemBackgroundsRepository from '../repositories/ISystemBackgroundsRepository';

type DefineCurrentSystemBackgroundRequest = {
  system_background_id: string;
  is_defined: boolean;
};

@injectable()
class DefineCurrentSystemBackgroundService {
  constructor(
    @inject('SystemBackgroundsRepository')
    private systemBackgroundsRepository: ISystemBackgroundsRepository,
  ) {}

  public async execute({
    system_background_id,
    is_defined,
  }: DefineCurrentSystemBackgroundRequest): Promise<SystemBackground> {
    const systemBackground = await this.systemBackgroundsRepository.findOne({
      id: system_background_id,
    });
    if (!systemBackground) {
      throw new AppError('System background not found');
    }

    if (is_defined === systemBackground.current_defined) {
      return systemBackground;
    }

    const newCurrentBackground = Object.assign(systemBackground, {
      current_defined: is_defined,
    });

    const updatedSystemBackground = await this.systemBackgroundsRepository.update(
      newCurrentBackground,
    );

    if (is_defined) {
      const currentDefinedBackgrounds = await this.systemBackgroundsRepository.findAll(
        {
          current_defined: true,
        },
      );

      const newBackgrounds = currentDefinedBackgrounds
        .filter(({ id }) => id !== updatedSystemBackground.id)
        .map(item => Object.assign(item, { current_defined: false }));
      await this.systemBackgroundsRepository.updateMany(newBackgrounds);
    }

    return updatedSystemBackground;
  }
}

export default DefineCurrentSystemBackgroundService;
