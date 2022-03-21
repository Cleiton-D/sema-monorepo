import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import School from '../infra/typeorm/entities/School';
import ISchoolsRepository from '../repositories/ISchoolsRepository';

type ShowSchoolRequest = {
  school_id?: string;
  branch_id?: string;
};

@injectable()
class ShowSchoolService {
  constructor(
    @inject('SchoolsRepository') private schoolsRepository: ISchoolsRepository,
  ) {}

  public async execute({
    branch_id,
    school_id,
  }: ShowSchoolRequest): Promise<School | undefined> {
    if (!branch_id && !school_id) {
      throw new AppError('School not found');
    }

    const school = await this.schoolsRepository.findOne({
      branch_id,
      id: school_id,
    });

    if (!school) {
      throw new AppError('School not found');
    }

    return school;
  }
}

export default ShowSchoolService;
