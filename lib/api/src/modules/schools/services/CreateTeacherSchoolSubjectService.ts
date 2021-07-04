import { inject, injectable } from 'tsyringe';

import TeacherSchoolSubject from '../infra/typeorm/entities/TeacherSchoolSubject';
import ITeacherSchoolSubjectsRepository from '../repositories/ITeacherSchoolSubjectsRepository';

type CreateTeacherSchoolSubjectRequest = {
  employee_id: string;
  school_subject_id: string;
  school_id: string;
};

@injectable()
class CreateTeacherSchoolSubjectService {
  constructor(
    @inject('TeacherSchoolSubjectsRepository')
    private teacherSchoolSubjectsRepository: ITeacherSchoolSubjectsRepository,
  ) {}

  public async execute({
    school_id,
    school_subject_id,
    employee_id,
  }: CreateTeacherSchoolSubjectRequest): Promise<TeacherSchoolSubject> {
    const schoolSubjects = await this.teacherSchoolSubjectsRepository.create({
      school_id,
      school_subject_id,
      employee_id,
    });

    return schoolSubjects;
  }
}

export default CreateTeacherSchoolSubjectService;
