import { inject, injectable } from 'tsyringe';
import Employee from '@modules/employees/infra/typeorm/entities/Employee';
import ITeachersRepository from '../repositories/ITeachersRepository';

type ListTeachersRequest = {
  school_id?: string;
};

@injectable()
class ListTeachersService {
  constructor(
    @inject('TeachersRepository')
    private teachersRepository: ITeachersRepository,
  ) {}

  public async execute({
    school_id,
  }: ListTeachersRequest): Promise<Employee[]> {
    const teachers = await this.teachersRepository.findAll({ school_id });
    return teachers;
  }
}

export default ListTeachersService;
