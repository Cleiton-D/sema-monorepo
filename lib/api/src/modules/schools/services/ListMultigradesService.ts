import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Multigrade from '../infra/typeorm/entities/Multigrade';
import IMultigradesRepository from '../repositories/IMultigradesRepository';
import ISchoolsRepository from '../repositories/ISchoolsRepository';

export type ListMultigradesRequest = {
  school_id?: string;
  branch_id?: string;
  class_period_id?: string;
};

@injectable()
class ListMultigradesService {
  constructor(
    @inject('SchoolsRepository') private schoolsRepository: ISchoolsRepository,
    @inject('MultigradesRepository')
    private multigradesRepository: IMultigradesRepository,
  ) {}

  public async execute({
    school_id,
    branch_id,
    class_period_id,
  }: ListMultigradesRequest): Promise<Multigrade[]> {
    const school = await this.schoolsRepository.findOne({
      branch_id,
      id: school_id,
    });

    if (!school) {
      throw new AppError('School not found');
    }

    return this.multigradesRepository.findAll({
      school_id: school.id,
      class_period_id,
    });
  }
}

export default ListMultigradesService;
