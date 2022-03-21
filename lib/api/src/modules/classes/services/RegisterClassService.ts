import { injectable, inject } from 'tsyringe';
import { parseISO } from 'date-fns';

import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';

import AppError from '@shared/errors/AppError';
import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';

import Class from '../infra/typeorm/entities/Class';
import IClassesRepository from '../repositories/IClassesRepository';
import CreateClassAttendancesService from './CreateClassAttendancesService';

type RegisterClassRequest = {
  user_id: string;
  school_subject_id: string;
  classroom_id: string;
  taught_content: string;
  period: string;
  class_date: string;
  school_term: SchoolTerm;
};

@injectable()
class RegisterClassService {
  constructor(
    @inject('ClassesRepository') private classesRepository: IClassesRepository,
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    private createClassAttendances: CreateClassAttendancesService,
  ) {}

  public async execute({
    user_id,
    classroom_id,
    school_subject_id,
    period,
    class_date,
    taught_content,
    school_term,
  }: RegisterClassRequest): Promise<Class> {
    const employee = await this.employeesRepository.findOne({ user_id });
    if (!employee) {
      throw new AppError('You cannot register an class');
    }

    const classEntity = await this.classesRepository.create({
      employee_id: employee.id,
      school_subject_id,
      classroom_id,
      period,
      date_start: new Date(),
      class_date: parseISO(class_date),
      taught_content,
      school_term,
    });

    await this.createClassAttendances.execute({ class: classEntity });

    return classEntity;
  }
}

export default RegisterClassService;
