import { inject, injectable } from 'tsyringe';
import path from 'path';

import uploadConfig from '@config/storage';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IBlurhashProvider from '@shared/container/providers/BlurhashProvider/models/IBlurhashProvider';

import SystemBackground from '../infra/typeorm/entities/SystemBackground';
import ISystemBackgroundsRepository from '../repositories/ISystemBackgroundsRepository';

type CreateSystemBackgroundRequest = {
  filename: string;
};

@injectable()
class CreateSystemBackgroundService {
  constructor(
    @inject('SystemBackgroundsRepository')
    private systemBackgroundsRepository: ISystemBackgroundsRepository,
    @inject('StorageProvider') private storageProvider: IStorageProvider,
    @inject('BlurhashProvider') private blurhashProvider: IBlurhashProvider,
  ) {}

  public async execute({
    filename,
  }: CreateSystemBackgroundRequest): Promise<SystemBackground> {
    const currentDefinedBackgrounds =
      await this.systemBackgroundsRepository.findAll({
        current_defined: true,
      });

    const file = await this.storageProvider.saveFile(filename);
    const filepath = path.join(uploadConfig.uploadsPath, file);

    const blurhash = await this.blurhashProvider.encode(filepath);

    const newCurrentBackgrounds = currentDefinedBackgrounds.map(item =>
      Object.assign(item, { current_defined: false }),
    );

    await this.systemBackgroundsRepository.updateMany(newCurrentBackgrounds);

    const systemBackground = await this.systemBackgroundsRepository.create({
      name: file,
      blurhash,
      current_defined: true,
    });

    return systemBackground;
  }
}

export default CreateSystemBackgroundService;
