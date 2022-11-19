import { injectable, inject } from 'tsyringe';

import SystemBackground from '../infra/typeorm/entities/SystemBackground';
import ISystemBackgroundsRepository from '../repositories/ISystemBackgroundsRepository';

@injectable()
class ListSystemBackgroundsService {
  constructor(
    @inject('SystemBackgroundsRepository')
    private systemBackgroundsRepository: ISystemBackgroundsRepository,
  ) {}

  public async execute(): Promise<SystemBackground[]> {
    const backgrounds = await this.systemBackgroundsRepository.findAll({});
    return backgrounds;
  }
}

export default ListSystemBackgroundsService;
