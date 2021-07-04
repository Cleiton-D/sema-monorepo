import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import SchoolSubject from '../infra/typeorm/entities/SchoolSubject';
import ISchoolSubjectsRepository from '../repositories/ISchoolSubjectsRepository';

type ShowSchoolSubjectRequest = {
  school_subject_id: string;
};

@injectable()
class ShowSchoolSubjectService {
  constructor(
    @inject('SchoolSubjectsRepository')
    private schoolSubjectsRepository: ISchoolSubjectsRepository,
  ) {}

  public async execute({
    school_subject_id,
  }: ShowSchoolSubjectRequest): Promise<SchoolSubject> {
    const schoolSubject = await this.schoolSubjectsRepository.findByid(
      school_subject_id,
    );
    if (!schoolSubject) {
      throw new AppError('School Subject not found');
    }

    return schoolSubject;
  }
}

export default ShowSchoolSubjectService;
