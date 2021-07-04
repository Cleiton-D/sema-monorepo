import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

type ChangePasswordRequest = {
  user_id: string;
  authenticated_user: string;
  password: string;
};

@injectable()
class ChangePasswordService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    authenticated_user,
    password,
  }: ChangePasswordRequest): Promise<User> {
    if (authenticated_user !== user_id) {
      throw new AppError("You can't change the password of another user");
    }

    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found');
    }
    if (!user.change_password) {
      throw new AppError('Password not allowed to change');
    }

    user.password = await this.hashProvider.generateHash(password);
    user.change_password = false;

    return this.usersRepository.update(user);
  }
}

export default ChangePasswordService;
