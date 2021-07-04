import { inject, injectable } from 'tsyringe';

import GradeSchoolSubject from '../infra/typeorm/entities/GradeSchoolSubject';

import IGradeSchoolSubjectsRepository from '../repositories/IGradeSchoolSubjectsRepository';

type ReplicateGradeSchoolSubjectsRequest = {
  old_school_year_id: string;
  new_school_year_id: string;
};

@injectable()
class ReplicateGradeSchoolSubjectsService {
  constructor(
    @inject('GradeSchoolSubjectsRepository')
    private gradeSchoolSubjectsRepository: IGradeSchoolSubjectsRepository,
  ) {}

  public async execute({
    old_school_year_id,
    new_school_year_id,
  }: ReplicateGradeSchoolSubjectsRequest): Promise<GradeSchoolSubject[]> {
    const oldGradeSchoolSubjects = await this.gradeSchoolSubjectsRepository.find(
      {
        school_year_id: old_school_year_id,
      },
    );

    const newGradeSchoolSubjectsData = oldGradeSchoolSubjects.map(
      ({ grade_id, school_subject_id, workload }) => ({
        school_year_id: new_school_year_id,
        grade_id,
        school_subject_id,
        workload,
      }),
    );

    const newGradeSchoolSubjects = await this.gradeSchoolSubjectsRepository.createMany(
      newGradeSchoolSubjectsData,
    );
    return newGradeSchoolSubjects;
  }
}

export default ReplicateGradeSchoolSubjectsService;
