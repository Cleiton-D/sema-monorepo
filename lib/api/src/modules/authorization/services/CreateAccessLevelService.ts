import { inject, injectable } from 'tsyringe';

import AccessLevel from '../infra/typeorm/entities/AccessLevel';
import { BranchType } from '../infra/typeorm/entities/Branch';
import IAccessLevelsRepository from '../repositories/IAccessLevelsRepository';

type CreateAccessLevelRequest = {
  description: string;
  code: string;
  only_on: BranchType;
};

@injectable()
class CreateAccessLevelService {
  constructor(
    @inject('AccessLevelsRepository')
    private accessLevelsRepository: IAccessLevelsRepository,
  ) {}

  public async execute({
    description,
    code,
    only_on,
  }: CreateAccessLevelRequest): Promise<AccessLevel> {
    const accessLevel = await this.accessLevelsRepository.create({
      description,
      code,
      only_on,
    });

    return accessLevel;
  }
}

export default CreateAccessLevelService;
