import { inject, injectable } from 'tsyringe';

import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';

type DeleteUserRequest = {
  user_id: string;
  auth_user_id: string;
};

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
  ) {}

  public async execute({
    user_id,
    auth_user_id,
  }: DeleteUserRequest): Promise<void> {
    if (user_id === auth_user_id) {
      throw new AppError('You cannot delete your own user.');
    }

    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found');
    }

    const employee = await this.employeesRepository.findOne({
      user_id: user.id,
    });
    if (employee) {
      throw new AppError(
        'You cannot delete this user because there is an employee linked to him.',
      );
    }

    await this.usersRepository.delete(user);
  }
}

export default DeleteUserService;
