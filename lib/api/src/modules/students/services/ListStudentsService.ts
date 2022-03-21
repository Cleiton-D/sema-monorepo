import { inject, injectable } from 'tsyringe';

import Student from '../infra/typeorm/entities/Student';
import IStudentsRepository from '../repositories/IStudentsRepository';

type ListStudentsRequest = {
  name?: string;
  cpf?: string;
  rg?: string;
  unique_code?: string;
};

@injectable()
class ListStudentsService {
  constructor(
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository,
  ) {}

  public async execute({
    name,
    cpf,
    rg,
    unique_code,
  }: ListStudentsRequest): Promise<Student[]> {
    const students = await this.studentsRepository.findAll({
      name,
      cpf,
      rg,
      unique_code,
    });

    return students;
  }
}

export default ListStudentsService;
