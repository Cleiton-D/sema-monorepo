import { inject, injectable } from 'tsyringe';

import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';

import AppError from '@shared/errors/AppError';
import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';

import Class from '../infra/typeorm/entities/Class';
import IClassesRepository from '../repositories/IClassesRepository';

type UpdateClassRequest = {
  class_id: string;
  user_id: string;
  school_subject_id?: string;
  taught_content: string;
  period: string;
  class_date: string;
  school_term: SchoolTerm;
};

@injectable()
class UpdateClassService {
  constructor(
    @inject('ClassesRepository') private classesRepository: IClassesRepository,
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
  ) {}

  public async execute({
    class_id,
    user_id,
    school_subject_id,
    taught_content,
    period,
    class_date,
    school_term,
  }: UpdateClassRequest): Promise<Class> {
    const employee = await this.employeesRepository.findOne({ user_id });
    if (!employee) {
      throw new AppError('You cannot register an class');
    }

    const classEntity = await this.classesRepository.findOne({ id: class_id });
    if (!classEntity) {
      throw new AppError('Class not found');
    }

    const newClass = Object.assign(classEntity, {
      school_subject_id,
      taught_content,
      period,
      class_date,
      school_term,
    });

    return this.classesRepository.update(newClass);
  }
}

export default UpdateClassService;
