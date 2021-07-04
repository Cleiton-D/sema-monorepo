import { inject, injectable } from 'tsyringe';

import AccessLevel from '../infra/typeorm/entities/AccessLevel';
import IAccessLevelsRepository from '../repositories/IAccessLevelsRepository';

@injectable()
class ListAccessLevelsService {
  constructor(
    @inject('AccessLevelsRepository')
    private accessLevelsRepository: IAccessLevelsRepository,
  ) {}

  public async execute(): Promise<AccessLevel[]> {
    const accessLevel = await this.accessLevelsRepository.findAll({});
    return accessLevel;
  }
}

export default ListAccessLevelsService;
