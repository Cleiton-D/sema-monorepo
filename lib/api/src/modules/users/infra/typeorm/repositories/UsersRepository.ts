import { getRepository, Repository } from 'typeorm';

import CreateUserDTO from '@modules/users/dtos/CreateUserDTO';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findByLogin(login: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      login,
    });
    return user;
  }

  public async findById(userId: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(userId);
    return user;
  }

  public async findAll(): Promise<User[]> {
    const users = await this.ormRepository.find();
    return users;
  }

  public async create({
    username,
    login,
    password,
  }: CreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ username, login, password });
    await this.ormRepository.save(user);

    return user;
  }

  public async update(user: User): Promise<User> {
    await this.ormRepository.save(user);
    return user;
  }

  public async delete(user: User): Promise<void> {
    await this.ormRepository.softRemove(user);
  }
}

export default UsersRepository;
