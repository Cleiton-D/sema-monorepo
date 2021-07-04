import { inject, injectable } from 'tsyringe';

import TeacherSchoolSubject from '../infra/typeorm/entities/TeacherSchoolSubject';
import ITeacherSchoolSubjectsRepository from '../repositories/ITeacherSchoolSubjectsRepository';

type ListTeacherSchoolSubjectsRequest = {
  school_id?: string;
  school_subject_id?: string | string[];
  employee_id?: string;
};

@injectable()
class ListTeacherSchoolSubjectsService {
  constructor(
    @inject('TeacherSchoolSubjectsRepository')
    private teacherSchoolSubjectsRepository: ITeacherSchoolSubjectsRepository,
  ) {}

  public async execute({
    school_id,
    school_subject_id,
    employee_id,
  }: ListTeacherSchoolSubjectsRequest): Promise<TeacherSchoolSubject[]> {
    const teacherSchoolSubjects = await this.teacherSchoolSubjectsRepository.findAll(
      { school_id, school_subject_id, employee_id },
    );

    return teacherSchoolSubjects;
  }
}

export default ListTeacherSchoolSubjectsService;
