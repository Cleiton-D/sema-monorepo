import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IGradeSchoolSubjectsRepository from '../repositories/IGradeSchoolSubjectsRepository';

type DeleteGradeSchoolSubjectRequest = {
  grade_school_subject_id: string;
};

@injectable()
class DeleteGradeSchoolSubjectService {
  constructor(
    @inject('GradeSchoolSubjectsRepository')
    private gradeSchoolSubjectsRepository: IGradeSchoolSubjectsRepository,
  ) {}

  public async execute({
    grade_school_subject_id,
  }: DeleteGradeSchoolSubjectRequest): Promise<void> {
    const gradeSchoolSubject = await this.gradeSchoolSubjectsRepository.findOne(
      { id: grade_school_subject_id },
    );
    if (!gradeSchoolSubject) {
      throw new AppError('Grade School Subject not found');
    }

    await this.gradeSchoolSubjectsRepository.delete(gradeSchoolSubject);
  }
}

export default DeleteGradeSchoolSubjectService;
