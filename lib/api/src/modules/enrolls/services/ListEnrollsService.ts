import { inject, injectable } from 'tsyringe';

import School from '@modules/schools/infra/typeorm/entities/School';
import ISchoolsRepository from '@modules/schools/repositories/ISchoolsRepository';

import AppError from '@shared/errors/AppError';
import { PaginatedResponse } from '@shared/dtos';

import Enroll, { EnrollStatus } from '../infra/typeorm/entities/Enroll';
import IEnrollsRepository from '../repositories/IEnrollsRepository';

export type ListEnrollsRequest = {
  classroom_id?: string;
  school_id?: string;
  branch_id?: string;
  grade_id?: string;
  status?: EnrollStatus;
  class_period_id?: string;
  student_name?: string;
  student_cpf?: string;
  student_nis?: string;
  student_birth_certificate?: string;
  order?: string | string[];
  page?: number;
  size?: number;
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
    class_period_id,
    student_name,
    student_cpf,
    student_nis,
    student_birth_certificate,
    status,
    order = [],
    page,
    size,
  }: ListEnrollsRequest): Promise<PaginatedResponse<Enroll>> {
    const schoolId =
      school_id || branch_id
        ? (await this.getSchool({ school_id, branch_id })).id
        : undefined;

    const orderArray = Array.isArray(order) ? order : [order];
    const enrolls = await this.enrollsRepository.findAll({
      grade_id,
      school_id: schoolId,
      classroom_id,
      class_period_id,
      status,
      student_name,
      student_cpf,
      student_nis,
      student_birth_certificate,
      order: orderArray,
      page,
      size,
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
