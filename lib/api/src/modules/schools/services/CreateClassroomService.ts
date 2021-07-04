import { inject, injectable } from 'tsyringe';

import IGradesRepository from '@modules/education_core/repositories/IGradesRepository';
import ISchoolYearsRepository from '@modules/education_core/repositories/ISchoolYearsRepository';

import AppError from '@shared/errors/AppError';

import Classroom from '../infra/typeorm/entities/Classroom';
import IClassroomsRepository from '../repositories/IClassroomsRepository';
import ISchoolsRepository from '../repositories/ISchoolsRepository';
import ISchoolClassPeriodsRepository from '../repositories/ISchoolClassPeriodsRepository';

type CreateClassroomRequest = {
  description: string;
  class_period_id: string;
  school_id?: string;
  branch_id?: string;
  grade_id: string;
  school_year_id: string;
};

@injectable()
class CreateClassroomService {
  constructor(
    @inject('ClassroomsRepository')
    private classroomsRepository: IClassroomsRepository,
    @inject('SchoolsRepository') private SchoolsRepository: ISchoolsRepository,
    @inject('GradesRepository') private gradesRepository: IGradesRepository,
    @inject('SchoolYearsRepository')
    private schoolYearsRepository: ISchoolYearsRepository,
    @inject('SchoolClassPeriodsRepository')
    private schoolClassPeriodsRepository: ISchoolClassPeriodsRepository,
  ) {}

  public async execute({
    description,
    class_period_id,
    grade_id,
    school_id,
    school_year_id,
    branch_id,
  }: CreateClassroomRequest): Promise<Classroom> {
    const school = await this.SchoolsRepository.findOne({
      id: school_id,
      branch_id,
    });
    if (!school) {
      throw new AppError('School not found');
    }

    const grade = await this.gradesRepository.findById(grade_id);
    if (!grade) {
      throw new AppError('Grade not found');
    }

    const schoolYear = await this.schoolYearsRepository.findById(
      school_year_id,
    );
    if (!schoolYear) {
      throw new AppError('School year not found');
    }

    const schoolClassPeriod = await this.schoolClassPeriodsRepository.getOne({
      school_year_id,
      school_id: school.id,
      class_period_id,
    });
    if (!schoolClassPeriod) {
      throw new AppError('School class period not found');
    }

    const classroom = await this.classroomsRepository.create({
      description,
      class_period_id: schoolClassPeriod.class_period_id,
      grade_id,
      school_id: school.id,
      school_year_id,
    });

    return classroom;
  }
}

export default CreateClassroomService;
