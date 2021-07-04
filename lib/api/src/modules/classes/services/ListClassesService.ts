import { inject, injectable } from 'tsyringe';

import Class from '../infra/typeorm/entities/Class';
import IClassesRepository from '../repositories/IClassesRepository';

type ListClassesRequest = {
  classroom_id?: string;
  school_subject_id?: string;
  employee_id?: string;
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
  }: ListClassesRequest): Promise<Class[]> {
    const classes = await this.classesRepository.findAll({
      classroom_id,
      employee_id,
      school_subject_id,
    });

    return classes;
  }
}

export default ListClassesService;
