import { inject, injectable } from 'tsyringe';

import ClassroomTeacherSchoolSubject from '../infra/typeorm/entities/ClassroomTeacherSchoolSubject';
import IClassroomTeacherSchoolSubjectsRepository from '../repositories/IClassroomTeacherSchoolSubjectsRepository';

type ShowClassroomTeacherSchoolSubjectsRequest = {
  id?: string;
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
    id,
    classroom_id,
    school_id,
    employee_id,
  }: ShowClassroomTeacherSchoolSubjectsRequest): Promise<
    ClassroomTeacherSchoolSubject | undefined
  > {
    const classroomTeacherSchoolSubject =
      await this.classroomTeacherSchoolSubjectsRepository.findOne({
        id,
        classroom_id: classroom_id === 'all' ? undefined : classroom_id,
        school_id,
        employee_id,
      });

    return classroomTeacherSchoolSubject;
  }
}

export default ShowClassroomTeacherSchoolSubjectsService;
