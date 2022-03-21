import { inject, injectable } from 'tsyringe';

import SchoolSubject from '../infra/typeorm/entities/SchoolSubject';
import ISchoolSubjectsRepository from '../repositories/ISchoolSubjectsRepository';
import ListGradeSchoolSubjectsService from './ListGradeSchoolSubjectsService';

type ListSchoolSubjectsRequest = {
  grade_id?: string;
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
  }: ListSchoolSubjectsRequest): Promise<SchoolSubject[]> {
    if (grade_id) {
      const gradeSchoolSubjects = await this.listGradeSchoolSubjects.execute({
        grade_id,
      });
      return gradeSchoolSubjects.map(({ school_subject }) => school_subject);
    }

    const schoolSubject = await this.schoolSubjectsRepository.findAll();
    return schoolSubject;
  }
}

export default ListSchoolSubjectService;
