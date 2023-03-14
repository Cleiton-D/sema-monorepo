import { inject, injectable } from 'tsyringe';

import GradeSchoolSubject from '../infra/typeorm/entities/GradeSchoolSubject';
import IGradeSchoolSubjectsRepository from '../repositories/IGradeSchoolSubjectsRepository';

export type ListGradeSchoolSubjectsRequest = {
  grade_id?: string | string[] | 'all';
  school_subject_id?: string | string[];
  is_multidisciplinary?: boolean;
  include_multidisciplinary?: boolean;
};

@injectable()
class ListGradeSchoolSubjectsService {
  constructor(
    @inject('GradeSchoolSubjectsRepository')
    private gradeSchoolSubjectsRepository: IGradeSchoolSubjectsRepository,
  ) {}

  public async execute({
    grade_id,
    school_subject_id,
    is_multidisciplinary,
    include_multidisciplinary,
  }: ListGradeSchoolSubjectsRequest): Promise<GradeSchoolSubject[]> {
    const gradeSchoolSubjects = await this.gradeSchoolSubjectsRepository.find({
      grade_id: grade_id !== 'all' ? grade_id : undefined,
      school_subject_id,
      is_multidisciplinary,
      include_multidisciplinary,
    });

    return gradeSchoolSubjects;
  }
}

export default ListGradeSchoolSubjectsService;
