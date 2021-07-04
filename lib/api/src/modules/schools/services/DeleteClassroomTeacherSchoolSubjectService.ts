import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IClassroomTeacherSchoolSubjectsRepository from '../repositories/IClassroomTeacherSchoolSubjectsRepository';

type DeleteClassroomTeacherSchoolSubjectRequest = {
  classroom_teacher_school_subject_id: string;
};

@injectable()
class DeleteClassroomTeacherSchoolSubjectService {
  constructor(
    @inject('ClassroomTeacherSchoolSubjectsRepository')
    private classroomTeacherSchoolSubjectsRepository: IClassroomTeacherSchoolSubjectsRepository,
  ) {}

  public async execute({
    classroom_teacher_school_subject_id,
  }: DeleteClassroomTeacherSchoolSubjectRequest): Promise<void> {
    const classroomTeacherSchoolSubject = await this.classroomTeacherSchoolSubjectsRepository.findOne(
      {
        id: classroom_teacher_school_subject_id,
      },
    );
    if (!classroomTeacherSchoolSubject) {
      throw new AppError('Classroom teacher school subject not found');
    }

    await this.classroomTeacherSchoolSubjectsRepository.delete(
      classroomTeacherSchoolSubject,
    );
  }
}

export default DeleteClassroomTeacherSchoolSubjectService;
