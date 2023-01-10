import { inject, injectable } from 'tsyringe';

import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';

import AppError from '@shared/errors/AppError';

import CreateUserProfileService from '@modules/users/services/CreateUserProfileService';
import SchoolTeacher from '../infra/typeorm/entities/SchoolTeacher';
import ISchoolsRepository from '../repositories/ISchoolsRepository';
import ISchoolTeachersRepository from '../repositories/ISchoolTeachersRepository';

type CreateSchoolTeacherRequest = {
  school_id: string;
  employee_id: string;
  school_year_id: string;
};

@injectable()
class CreateSchoolTeacherService {
  constructor(
    @inject('SchoolTeachersRepository')
    private schoolTeachersRepository: ISchoolTeachersRepository,
    @inject('SchoolsRepository') private schoolsRepository: ISchoolsRepository,
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    private createUserprofile: CreateUserProfileService,
  ) {}

  public async execute({
    school_id,
    employee_id,
    school_year_id,
  }: CreateSchoolTeacherRequest): Promise<SchoolTeacher> {
    const school = await this.schoolsRepository.findOne({ id: school_id });
    if (!school) {
      throw new AppError('School not found');
    }

    const employee = await this.employeesRepository.findOne({
      id: employee_id,
    });
    if (!employee) {
      throw new AppError('Employee not found');
    }

    const schoolTeacher = await this.schoolTeachersRepository.create({
      school_id,
      employee_id,
      school_year_id,
    });

    await this.createUserprofile.execute({
      branch_id: school.branch_id,
      user_id: employee.user_id,
      access_level_name: 'teacher',
    });

    return schoolTeacher;
  }
}

export default CreateSchoolTeacherService;
