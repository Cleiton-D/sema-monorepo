import { inject, injectable } from 'tsyringe';

import SchoolSubject from '../infra/typeorm/entities/SchoolSubject';
import ISchoolSubjectsRepository from '../repositories/ISchoolSubjectsRepository';

@injectable()
class ListSchoolSubjectService {
  constructor(
    @inject('SchoolSubjectsRepository')
    private schoolSubjectsRepository: ISchoolSubjectsRepository,
  ) {}

  public async execute(): Promise<SchoolSubject[]> {
    const schoolSubject = await this.schoolSubjectsRepository.findAll();
    return schoolSubject;
  }
}

export default ListSchoolSubjectService;
