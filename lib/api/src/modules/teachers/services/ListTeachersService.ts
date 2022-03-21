import { inject, injectable } from 'tsyringe';
import Employee from '@modules/employees/infra/typeorm/entities/Employee';
import ITeachersRepository from '../repositories/ITeachersRepository';

@injectable()
class ListTeachersService {
  constructor(
    @inject('TeachersRepository')
    private teachersRepository: ITeachersRepository,
  ) {}

  public async execute(): Promise<Employee[]> {
    const teachers = await this.teachersRepository.findAll();
    return teachers;
  }
}

export default ListTeachersService;
