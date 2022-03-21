import { inject, injectable } from 'tsyringe';

import Class, { ClassStatus } from '../infra/typeorm/entities/Class';
import IClassesRepository from '../repositories/IClassesRepository';

type ListClassesRequest = {
  classroom_id?: string;
  school_subject_id?: string;
  employee_id?: string;
  school_id?: string;
  class_date?: string;
  class_period_id?: string;
  grade_id?: string;
  status?: ClassStatus;
  taught_content?: string;
  limit?: number;
  sortBy?: string;
  order?: 'DESC' | 'ASC';
};

@injectable()
class ListClassesService {
  constructor(
    @inject('ClassesRepository') private classesRepository: IClassesRepository,
  ) {}

  public async execute({
    classroom_id,
    employee_id,
    school_subject_id,
    school_id,
    class_date,
    class_period_id,
    grade_id,
    status,
    taught_content,
    limit,
    sortBy,
    order,
  }: ListClassesRequest): Promise<Class[]> {
    const classes = await this.classesRepository.findAll({
      classroom_id,
      employee_id,
      school_subject_id,
      school_id,
      class_date,
      class_period_id,
      grade_id,
      status,
      taught_content,
      limit,
      sortBy,
      order,
    });

    return classes;
  }
}

export default ListClassesService;
