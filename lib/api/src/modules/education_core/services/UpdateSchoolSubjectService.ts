import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

import SchoolSubject from '../infra/typeorm/entities/SchoolSubject';

import ISchoolSubjectsRepository from '../repositories/ISchoolSubjectsRepository';

type UpdateSchoolSubjectRequest = {
  id: string;
  description: string;
  additional_description: string;
};

@injectable()
class UpdateSchoolSubjectService {
  constructor(
    @inject('SchoolSubjectsRepository')
    private schoolSubjectsRepository: ISchoolSubjectsRepository,
  ) {}

  public async execute({
    id,
    description,
    additional_description,
  }: UpdateSchoolSubjectRequest): Promise<SchoolSubject> {
    const schoolSubject = await this.schoolSubjectsRepository.findByid(id);
    if (!schoolSubject) {
      throw new AppError('School Subject not found.');
    }

    Object.assign(schoolSubject, { description, additional_description });

    return this.schoolSubjectsRepository.update(schoolSubject);
  }
}

export default UpdateSchoolSubjectService;
