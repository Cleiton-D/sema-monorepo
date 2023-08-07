import { inject, injectable } from 'tsyringe';

import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';

import AppError from '@shared/errors/AppError';
import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';

import IClassroomsRepository from '@modules/schools/repositories/IClassroomsRepository';
import ISchoolSubjectsRepository from '@modules/education_core/repositories/ISchoolSubjectsRepository';
import ShowSchoolYearService from '@modules/education_core/services/ShowSchoolYearService';
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
    @inject('ClassroomsRepository')
    private classroomsRepository: IClassroomsRepository,
    @inject('SchoolSubjectsRepository')
    private schoolSubjectsRepository: ISchoolSubjectsRepository,
    private showSchoolYear: ShowSchoolYearService,
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

    if (school_subject_id) {
      const classroom = await this.classroomsRepository.findById(
        classEntity.classroom_id,
      );
      if (!classroom) {
        throw new AppError('Classroom not found');
      }

      const schoolSubject = await this.schoolSubjectsRepository.findOne({
        id: school_subject_id,
        include_multidisciplinary: true,
      });
      if (!schoolSubject) {
        throw new AppError('School Subject not found');
      }

      if (classroom.school_year_id !== schoolSubject.school_year_id) {
        throw new AppError('Invalid school subject');
      }

      const schoolYear = await this.showSchoolYear.execute({
        school_year_id: classroom.school_year_id,
      });
      if (schoolYear.status !== 'ACTIVE') {
        throw new AppError('School year not active');
      }
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
