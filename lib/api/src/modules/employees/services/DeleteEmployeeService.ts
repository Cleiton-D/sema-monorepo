import { inject, injectable } from 'tsyringe';

import DeleteUserService from '@modules/users/services/DeleteUserService';

import AppError from '@shared/errors/AppError';

import IEmployeesRepository from '../repositories/IEmployeesRepository';

type DeleteEmployeeRequest = {
  auth_user_id: string;
  employee_id: string;
};

@injectable()
class DeleteEmployeeService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    private deleteUser: DeleteUserService,
  ) {}

  public async execute({
    employee_id,
    auth_user_id,
  }: DeleteEmployeeRequest): Promise<void> {
    const employee = await this.employeesRepository.findOne({
      id: employee_id,
    });
    if (!employee) {
      throw new AppError('Employee not found');
    }

    const { user_id } = employee;
    await this.employeesRepository.delete(employee);

    await this.deleteUser.execute({
      auth_user_id,
      user_id,
    });
  }
}

export default DeleteEmployeeService;
