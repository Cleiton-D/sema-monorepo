import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import Employee from '../infra/typeorm/entities/Employee';
import IEmployeesRepository from '../repositories/IEmployeesRepository';

type ListEmployeesRequest = {
  accessCode?: string;
  branch_id?: string;
};

@injectable()
class ListEmployeesService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
  ) {}

  public async execute({
    accessCode,
    branch_id,
  }: ListEmployeesRequest): Promise<Employee[]> {
    const employees = await this.employeesRepository.findAll({
      accessCode,
      branch: branch_id,
    });

    const convertedEmployees = classToClass(employees);
    return convertedEmployees;
  }
}

export default ListEmployeesService;
