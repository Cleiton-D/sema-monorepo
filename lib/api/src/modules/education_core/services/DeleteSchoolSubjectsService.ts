import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ISchoolSubjectsRepository from '../repositories/ISchoolSubjectsRepository';

type DeleteSchoolSubjectRequest = {
  school_subject_id: string;
};

@injectable()
class DeleteSchoolSubjectService {
  constructor(
    @inject('SchoolSubjectsRepository')
    private schoolSubjectsRepository: ISchoolSubjectsRepository,
  ) {}

  public async execute({
    school_subject_id,
  }: DeleteSchoolSubjectRequest): Promise<void> {
    const schoolSubject = await this.schoolSubjectsRepository.findByid(
      school_subject_id,
    );
    if (!schoolSubject) {
      throw new AppError('School Subject not found');
    }
    await this.schoolSubjectsRepository.delete(schoolSubject);
  }
}

export default DeleteSchoolSubjectService;
