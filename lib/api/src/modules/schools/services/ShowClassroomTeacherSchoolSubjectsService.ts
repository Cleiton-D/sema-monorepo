import { inject, injectable } from 'tsyringe';

import ClassroomTeacherSchoolSubject from '../infra/typeorm/entities/ClassroomTeacherSchoolSubject';
import IClassroomTeacherSchoolSubjectsRepository from '../repositories/IClassroomTeacherSchoolSubjectsRepository';

type ShowClassroomTeacherSchoolSubjectsRequest = {
  classroom_id?: string | 'all';
  school_id?: string;
  employee_id?: string;
};

@injectable()
class ShowClassroomTeacherSchoolSubjectsService {
  constructor(
    @inject('ClassroomTeacherSchoolSubjectsRepository')
    private classroomTeacherSchoolSubjectsRepository: IClassroomTeacherSchoolSubjectsRepository,
  ) {}

  public async execute({
    classroom_id,
    school_id,
    employee_id,
  }: ShowClassroomTeacherSchoolSubjectsRequest): Promise<
    ClassroomTeacherSchoolSubject | undefined
  > {
    const classroomTeacherSchoolSubjects = await this.classroomTeacherSchoolSubjectsRepository.findOne(
      {
        classroom_id: classroom_id === 'all' ? undefined : classroom_id,
        school_id,
        employee_id,
      },
    );

    return classroomTeacherSchoolSubjects;
  }
}

export default ShowClassroomTeacherSchoolSubjectsService;
