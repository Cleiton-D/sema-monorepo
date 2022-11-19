import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import ISystemBackgroundsRepository from '../repositories/ISystemBackgroundsRepository';

type DeleteSystemBackgroundRequest = {
  system_background_id: string;
};

@injectable()
class DeleteSystemBackgroundService {
  constructor(
    @inject('SystemBackgroundsRepository')
    private systemBackgroundsRepository: ISystemBackgroundsRepository,
    @inject('StorageProvider') private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    system_background_id,
  }: DeleteSystemBackgroundRequest): Promise<void> {
    const systemBackground = await this.systemBackgroundsRepository.findOne({
      id: system_background_id,
    });
    if (!systemBackground) {
      throw new AppError('System background not found');
    }

    await this.storageProvider.deleteFile(systemBackground.name);
    await this.systemBackgroundsRepository.delete(systemBackground);
  }
}

export default DeleteSystemBackgroundService;
