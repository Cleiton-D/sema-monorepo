import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

type CreateUserRequest = {
  username: string;
  login: string;
  password: string;
};

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({
    username,
    login,
    password,
  }: CreateUserRequest): Promise<User> {
    const existsUserWithLogin = await this.usersRepository.findByLogin(login);
    if (existsUserWithLogin) {
      throw new AppError('Already an user with this e-mail');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      username,
      login,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
