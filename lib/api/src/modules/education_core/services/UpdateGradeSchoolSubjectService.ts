import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import GradeSchoolSubject from '../infra/typeorm/entities/GradeSchoolSubject';
import IGradeSchoolSubjectsRepository from '../repositories/IGradeSchoolSubjectsRepository';

type UpdateGradeSchoolSubjectRequest = {
  grade_school_subject_id: string;
  workload: number;
};

@injectable()
class UpdateGradeSchoolSubjectService {
  constructor(
    @inject('GradeSchoolSubjectsRepository')
    private gradeSchoolSubjectsRepository: IGradeSchoolSubjectsRepository,
  ) {}

  public async execute({
    grade_school_subject_id,
    workload,
  }: UpdateGradeSchoolSubjectRequest): Promise<GradeSchoolSubject> {
    const gradeSchoolSubject = await this.gradeSchoolSubjectsRepository.findOne(
      { id: grade_school_subject_id, include_multidisciplinary: true },
    );
    if (!gradeSchoolSubject) {
      throw new AppError('Grade School Subject not found');
    }

    const newGradeSchoolSubject = Object.assign(gradeSchoolSubject, {
      workload,
    });

    return this.gradeSchoolSubjectsRepository.update(newGradeSchoolSubject);
  }
}

export default UpdateGradeSchoolSubjectService;
