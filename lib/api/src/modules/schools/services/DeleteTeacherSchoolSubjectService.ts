import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ITeacherSchoolSubjectsRepository from '../repositories/ITeacherSchoolSubjectsRepository';

type DeleteTeacherSchoolSubjectRequest = {
  teacher_school_subject_id: string;
};

@injectable()
class DeleteTeacherSchoolSubjectService {
  constructor(
    @inject('TeacherSchoolSubjectsRepository')
    private teacherSchoolSubjectsRepository: ITeacherSchoolSubjectsRepository,
  ) {}

  public async execute({
    teacher_school_subject_id,
  }: DeleteTeacherSchoolSubjectRequest): Promise<void> {
    const teacherSchoolSubject = await this.teacherSchoolSubjectsRepository.findById(
      teacher_school_subject_id,
    );
    if (!teacherSchoolSubject) {
      throw new AppError('Teacher School Subject not found.');
    }

    await this.teacherSchoolSubjectsRepository.delete(teacherSchoolSubject);
  }
}

export default DeleteTeacherSchoolSubjectService;
