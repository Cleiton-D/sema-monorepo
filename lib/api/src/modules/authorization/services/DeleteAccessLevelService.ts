import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

import AccessLevelsRepository from '../infra/typeorm/repositories/AccessLevelsRepository';

type DeleteAccessLevelRequest = {
  access_level_id: string;
};
@injectable()
class DeleteAccessLevelService {
  constructor(
    @inject('AccessLevelsRepository')
    private accessLevelsRepository: AccessLevelsRepository,
  ) {}

  public async execute({
    access_level_id,
  }: DeleteAccessLevelRequest): Promise<void> {
    const accessLevel = await this.accessLevelsRepository.findOne({
      id: access_level_id,
    });
    if (!accessLevel) {
      throw new AppError('Access Level not found');
    }
    await this.accessLevelsRepository.delete(accessLevel);
  }
}

export default DeleteAccessLevelService;
