import { inject, injectable } from 'tsyringe';

import SchoolSubject from '../infra/typeorm/entities/SchoolSubject';

import ISchoolSubjectsRepository from '../repositories/ISchoolSubjectsRepository';

type CreateSchoolSubjectRequest = {
  description: string;
  additional_description: string;
  index: number;
};

@injectable()
class CreateSchoolSubjectService {
  constructor(
    @inject('SchoolSubjectsRepository')
    private schoolSubjectsRepository: ISchoolSubjectsRepository,
  ) {}

  public async execute({
    description,
    additional_description,
    index,
  }: CreateSchoolSubjectRequest): Promise<SchoolSubject> {
    const schoolSubject = await this.schoolSubjectsRepository.create({
      description,
      additional_description,
      index,
    });

    return schoolSubject;
  }
}

export default CreateSchoolSubjectService;
