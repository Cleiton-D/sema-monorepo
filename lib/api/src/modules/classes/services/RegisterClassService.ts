import { injectable, inject } from 'tsyringe';
import { parseISO } from 'date-fns';

import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';
import IClassroomsRepository from '@modules/schools/repositories/IClassroomsRepository';
import IMultigradesClassroomsRepository from '@modules/schools/repositories/IMultigradesClassroomsRepository';
import ShowSchoolYearService from '@modules/education_core/services/ShowSchoolYearService';
import ShowSchoolTermPeriodService from '@modules/education_core/services/ShowSchoolTermPeriodService';

import AppError from '@shared/errors/AppError';

import Class from '../infra/typeorm/entities/Class';
import IClassesRepository from '../repositories/IClassesRepository';
import CreateClassAttendancesService from './CreateClassAttendancesService';

type RegisterClassRequest = {
  user_id: string;
  school_subject_id?: string;
  classroom_id: string;
  taught_content: string;
  period: string;
  class_date: string;
};

@injectable()
class RegisterClassService {
  constructor(
    @inject('ClassesRepository') private classesRepository: IClassesRepository,
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    @inject('ClassroomsRepository')
    private classroomsRepository: IClassroomsRepository,
    @inject('MultigradesClassroomsRepository')
    private multigradesClassroomsRepository: IMultigradesClassroomsRepository,
    private createClassAttendances: CreateClassAttendancesService,
    private showSchoolYear: ShowSchoolYearService,
    private showSchoolTermPeriod: ShowSchoolTermPeriodService,
  ) {}

  public async execute({
    user_id,
    classroom_id,
    school_subject_id,
    period,
    class_date,
    taught_content,
  }: RegisterClassRequest): Promise<Class> {
    const schoolYear = await this.showSchoolYear.execute({
      school_year_id: 'current',
    });
    if (schoolYear.status !== 'ACTIVE') {
      throw new AppError('Not exist a school year active');
    }

    const employee = await this.employeesRepository.findOne({ user_id });
    if (!employee) {
      throw new AppError('You cannot register an class');
    }

    const classroom = await this.classroomsRepository.findById(classroom_id);
    if (!classroom) {
      throw new AppError('Classroom not found');
    }

    const schoolTermPeriod = await this.showSchoolTermPeriod.execute({
      contain_date: parseISO(class_date.replace(/z$/i, '')),
      school_year_id: schoolYear.id,
      status: 'ACTIVE',
    });

    const existentClass = await this.classesRepository.findOne({
      employee_id: employee.id,
      class_date,
      period,
    });
    if (existentClass) {
      throw new AppError(
        'Already exist a class registered for you in this period',
      );
    }

    let multiclasses: Array<{ classroom_id: string }> = [];
    if (classroom.is_multigrade) {
      const multigrades = await this.multigradesClassroomsRepository.findAll({
        owner_id: classroom.id,
      });

      multiclasses = multigrades.map(multigrade => ({
        classroom_id: multigrade.classroom_id,
      }));
    }

    const classEntity = await this.classesRepository.create({
      employee_id: employee.id,
      school_subject_id,
      classroom_id,
      period,
      date_start: new Date(),
      class_date: parseISO(class_date),
      taught_content,
      school_term: schoolTermPeriod.school_term,
      multiclasses,
    });

    await this.createClassAttendances.execute({ class: classEntity });

    return classEntity;
  }
}

export default RegisterClassService;
