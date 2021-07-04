import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Classroom from '../infra/typeorm/entities/Classroom';
import IClassroomsRepository from '../repositories/IClassroomsRepository';
import ISchoolsRepository from '../repositories/ISchoolsRepository';

type ListClassroomsRequest = {
  school_id?: string;
  branch_id?: string;
  grade_id?: string;
  class_period_id?: string;
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
  }: ListClassroomsRequest): Promise<Classroom[]> {
    const school = await this.schoolsRepository.findOne({
      branch_id,
      id: school_id,
    });

    if (!school) {
      throw new AppError('School not found');
    }

    const classrooms = this.classroomsRepository.findAll({
      school_id: school.id,
      grade_id,
      class_period_id,
    });

    return classrooms;
  }
}

export default ListClassroomsService;
