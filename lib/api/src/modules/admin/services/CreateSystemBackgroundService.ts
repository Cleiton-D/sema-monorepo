import { inject, injectable } from 'tsyringe';

import SystemBackground from '../infra/typeorm/entities/SystemBackground';
import ISystemBackgroundsRepository from '../repositories/ISystemBackgroundsRepository';

type CreateSystemBackgroundRequest = {
  name: string;
  blurhash: string;
};

@injectable()
class CreateSystemBackgroundService {
  constructor(
    @inject('SystemBackgroundsRepository')
    private systemBackgroundsRepository: ISystemBackgroundsRepository,
  ) {}

  public async execute({
    name,
    blurhash,
  }: CreateSystemBackgroundRequest): Promise<SystemBackground> {
    const currentDefinedBackgrounds = await this.systemBackgroundsRepository.findAll(
      {
        current_defined: true,
      },
    );

    const newCurrentBackgrounds = currentDefinedBackgrounds.map(item =>
      Object.assign(item, { current_defined: false }),
    );

    await this.systemBackgroundsRepository.updateMany(newCurrentBackgrounds);

    const systemBackground = await this.systemBackgroundsRepository.create({
      name,
      blurhash,
      current_defined: true,
    });

    return systemBackground;
  }
}

export default CreateSystemBackgroundService;
