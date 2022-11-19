import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { PaginatedResponse } from '@shared/dtos';

import Classroom from '../infra/typeorm/entities/Classroom';
import IClassroomsRepository from '../repositories/IClassroomsRepository';
import ISchoolsRepository from '../repositories/ISchoolsRepository';
import FindClassroomsDTO from '../dtos/FindClassroomsDTO';

export type ListClassroomsRequest = {
  school_id?: string;
  branch_id?: string;
  grade_id?: string;
  class_period_id?: string;
  employee_id?: string;
  with_in_multigrades?: boolean;
  with_multigrades?: boolean;
  page?: number;
  size?: number;
};

@injectable()
class ListClassroomsService {
  constructor(
    @inject('SchoolsRepository') private schoolsRepository: ISchoolsRepository,
    @inject('ClassroomsRepository')
    private classroomsRepository: IClassroomsRepository,
  ) {}

  public async execute({
    branch_id,
    school_id,
    grade_id,
    class_period_id,
    employee_id,
    with_in_multigrades = true,
    with_multigrades = false,
    page,
    size,
  }: ListClassroomsRequest): Promise<PaginatedResponse<Classroom>> {
    const searchFilters: FindClassroomsDTO = {
      grade_id,
      class_period_id,
      employee_id,
      with_in_multigrades: !with_in_multigrades ? false : undefined,
      with_multigrades,
      page,
      size,
    };

    if (branch_id || school_id) {
      const school = await this.schoolsRepository.findOne({
        branch_id,
        id: school_id,
      });

      if (!school) {
        throw new AppError('School not found');
      }

      searchFilters.school_id = school.id;
    }

    const classrooms = this.classroomsRepository.findAll(searchFilters);
    return classrooms;
  }
}

export default ListClassroomsService;
