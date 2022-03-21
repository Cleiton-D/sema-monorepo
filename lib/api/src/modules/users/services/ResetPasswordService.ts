import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

type ResetPasswordRequest = {
  user_id: string;
  authenticated_user: string;
};

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    authenticated_user,
  }: ResetPasswordRequest): Promise<void> {
    if (!authenticated_user) {
      throw new AppError("You can't reset password", 401);
    }

    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found');
    }

    user.password = await this.hashProvider.generateHash('12345678');
    user.change_password = true;

    await this.usersRepository.update(user);
  }
}

export default ResetPasswordService;
