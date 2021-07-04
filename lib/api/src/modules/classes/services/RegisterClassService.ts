import { injectable, inject } from 'tsyringe';
import { parseISO } from 'date-fns';

import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';
import IClassroomTeacherSchoolSubjectsRepository from '@modules/schools/repositories/IClassroomTeacherSchoolSubjectsRepository';

import AppError from '@shared/errors/AppError';

import Class from '../infra/typeorm/entities/Class';
import IClassesRepository from '../repositories/IClassesRepository';
import CreateClassAttendancesService from './CreateClassAttendancesService';

type RegisterClassRequest = {
  user_id: string;
  school_subject_id: string;
  classroom_id: string;
  taught_content: string;
  time_start: string;
  class_date: string;
};

@injectable()
class RegisterClassService {
  constructor(
    @inject('ClassesRepository') private classesRepository: IClassesRepository,
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    @inject('ClassroomTeacherSchoolSubjectsRepository')
    private classroomTeacherSchoolSubjectsRepository: IClassroomTeacherSchoolSubjectsRepository,
    private createClassAttendances: CreateClassAttendancesService,
  ) {}

  public async execute({
    user_id,
    classroom_id,
    school_subject_id,
    class_date,
    time_start,
    taught_content,
  }: RegisterClassRequest): Promise<Class> {
    const employee = await this.employeesRepository.findOne({ user_id });
    if (!employee) {
      throw new AppError('You cannot register an class');
    }

    const classroomTeacherSchoolSubject = await this.classroomTeacherSchoolSubjectsRepository.findOne(
      {
        classroom_id,
        employee_id: employee.id,
        school_subject_id,
      },
    );

    if (!classroomTeacherSchoolSubject) {
      throw new AppError(
        'You cannot register a class of this subject in this classroom',
      );
    }

    const classEntity = await this.classesRepository.create({
      employee_id: employee.id,
      school_subject_id,
      classroom_id,
      class_date: parseISO(class_date),
      time_start,
      taught_content,
    });

    await this.createClassAttendances.execute({ class: classEntity });

    return classEntity;
  }
}

export default RegisterClassService;
