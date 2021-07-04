import { inject, injectable } from 'tsyringe';

import ClassroomTeacherSchoolSubject from '../infra/typeorm/entities/ClassroomTeacherSchoolSubject';
import IClassroomTeacherSchoolSubjectsRepository from '../repositories/IClassroomTeacherSchoolSubjectsRepository';

type ListClassroomTeacherSchoolSubjectsRequest = {
  classroom_id?: string | 'all';
  school_id?: string;
  employee_id?: string;
};

@injectable()
class ListClassroomTeacherSchoolSubjectsService {
  constructor(
    @inject('ClassroomTeacherSchoolSubjectsRepository')
    private classroomTeacherSchoolSubjectsRepository: IClassroomTeacherSchoolSubjectsRepository,
  ) {}

  public async execute({
    classroom_id,
    school_id,
    employee_id,
  }: ListClassroomTeacherSchoolSubjectsRequest): Promise<
    ClassroomTeacherSchoolSubject[]
  > {
    const classroomTeacherSchoolSubjects = await this.classroomTeacherSchoolSubjectsRepository.findAll(
      {
        classroom_id: classroom_id === 'all' ? undefined : classroom_id,
        school_id,
        employee_id,
      },
    );

    return classroomTeacherSchoolSubjects;
  }
}

export default ListClassroomTeacherSchoolSubjectsService;
