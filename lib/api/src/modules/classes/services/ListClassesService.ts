import { PaginatedResponse } from '@shared/dtos';
import { inject, injectable } from 'tsyringe';

import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';

import Class, { ClassStatus } from '../infra/typeorm/entities/Class';
import IClassesRepository from '../repositories/IClassesRepository';

type ListClassesRequest = {
  classroom_id?: string;
  school_subject_id?: string;
  employee_id?: string;
  school_id?: string;
  class_date?: string;
  class_period_id?: string;
  school_year_id?: string;
  grade_id?: string;
  status?: ClassStatus;
  taught_content?: string;
  school_term?: SchoolTerm;
  limit?: number;
  sortBy?: string;
  order?: 'DESC' | 'ASC';
  before?: string;
  page?: number;
  size?: number;
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
    school_year_id,
    school_id,
    class_date,
    class_period_id,
    grade_id,
    status,
    taught_content,
    school_term,
    limit,
    sortBy,
    order,
    before,
    page,
    size,
  }: ListClassesRequest): Promise<PaginatedResponse<Class>> {
    const classes = await this.classesRepository.findAll({
      classroom_id,
      employee_id,
      school_subject_id,
      school_id,
      class_date,
      class_period_id,
      school_year_id,
      grade_id,
      status,
      taught_content,
      school_term,
      limit,
      sortBy,
      order,
      before,
      page,
      size,
    });

    return classes;
  }
}

export default ListClassesService;
