import { inject, injectable } from 'tsyringe';

import SchoolSubject from '../infra/typeorm/entities/SchoolSubject';
import ISchoolSubjectsRepository from '../repositories/ISchoolSubjectsRepository';
import ListGradeSchoolSubjectsService from './ListGradeSchoolSubjectsService';

export type ListSchoolSubjectsRequest = {
  grade_id?: string;
  include_multidisciplinary?: boolean;
  is_multidisciplinary?: boolean;
};

@injectable()
class ListSchoolSubjectService {
  constructor(
    @inject('SchoolSubjectsRepository')
    private schoolSubjectsRepository: ISchoolSubjectsRepository,
    private listGradeSchoolSubjects: ListGradeSchoolSubjectsService,
  ) {}

  public async execute({
    grade_id,
    include_multidisciplinary,
    is_multidisciplinary,
  }: ListSchoolSubjectsRequest): Promise<SchoolSubject[]> {
    if (grade_id) {
      const gradeSchoolSubjects = await this.listGradeSchoolSubjects.execute({
        grade_id,
        include_multidisciplinary,
        is_multidisciplinary,
      });
      return gradeSchoolSubjects.map(({ school_subject }) => school_subject);
    }

    const schoolSubject = await this.schoolSubjectsRepository.findAll({
      include_multidisciplinary,
      is_multidisciplinary,
    });
    return schoolSubject;
  }
}

export default ListSchoolSubjectService;
