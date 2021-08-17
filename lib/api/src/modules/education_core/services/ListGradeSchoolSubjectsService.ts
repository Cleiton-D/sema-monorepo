import { inject, injectable } from 'tsyringe';

import GradeSchoolSubject from '../infra/typeorm/entities/GradeSchoolSubject';
import IGradeSchoolSubjectsRepository from '../repositories/IGradeSchoolSubjectsRepository';

type ListGradeSchoolSubjectsRequest = {
  grade_id?: string | 'all';
  school_subject_id?: string;
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
  }: ListGradeSchoolSubjectsRequest): Promise<GradeSchoolSubject[]> {
    const gradeSchoolSubjects = await this.gradeSchoolSubjectsRepository.find({
      grade_id: grade_id !== 'all' ? grade_id : undefined,
      school_subject_id,
    });

    return gradeSchoolSubjects;
  }
}

export default ListGradeSchoolSubjectsService;
