import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Employee from '../infra/typeorm/entities/Employee';
import IEmployeesRepository from '../repositories/IEmployeesRepository';

type ShowEmployeeRequest = {
  employee_id?: string | 'me';
  user_id?: string;
  branch_id?: string;
  accessCode?: string;
};

@injectable()
class ShowEmployeeService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
  ) {}

  public async execute({
    employee_id,
    user_id,
    accessCode,
    branch_id,
  }: ShowEmployeeRequest): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({
      id: employee_id === 'me' ? undefined : employee_id,
      user_id,
      accessCode,
      branch: branch_id,
    });
    if (!employee) {
      throw new AppError('Employee not found');
    }

    return employee;
  }
}

export default ShowEmployeeService;
