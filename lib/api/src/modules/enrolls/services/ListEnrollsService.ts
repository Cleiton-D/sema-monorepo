import { inject, injectable } from 'tsyringe';

import School from '@modules/schools/infra/typeorm/entities/School';
import ISchoolsRepository from '@modules/schools/repositories/ISchoolsRepository';

import AppError from '@shared/errors/AppError';

import Enroll from '../infra/typeorm/entities/Enroll';
import IEnrollsRepository from '../repositories/IEnrollsRepository';

type ListEnrollsRequest = {
  classroom_id?: string;
  school_id?: string;
  branch_id?: string;
  grade_id?: string;
};

@injectable()
class ListEnrollsService {
  constructor(
    @inject('EnrollsRepository') private enrollsRepository: IEnrollsRepository,
    @inject('SchoolsRepository') private schoolsRepository: ISchoolsRepository,
  ) {}

  public async execute({
    classroom_id,
    grade_id,
    school_id,
    branch_id,
  }: ListEnrollsRequest): Promise<Enroll[]> {
    const schoolId =
      school_id || branch_id
        ? await (await this.getSchool({ school_id, branch_id })).id
        : undefined;

    const enrolls = await this.enrollsRepository.findAll({
      grade_id,
      school_id: schoolId,
      classroom_id,
    });
    return enrolls;
  }

  private async getSchool({
    branch_id,
    school_id,
  }: Pick<ListEnrollsRequest, 'school_id' | 'branch_id'>): Promise<School> {
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

export default ListEnrollsService;
