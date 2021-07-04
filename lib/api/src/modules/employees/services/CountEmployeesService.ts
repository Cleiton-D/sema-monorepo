import { inject, injectable } from 'tsyringe';
import IEmployeesRepository from '../repositories/IEmployeesRepository';

type CountEmployeesResponse = {
  count: number;
};

@injectable()
class CountEmployeesService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
  ) {}

  public async execute(): Promise<CountEmployeesResponse> {
    const { count } = await this.employeesRepository.count();
    return { count };
  }
}

export default CountEmployeesService;
