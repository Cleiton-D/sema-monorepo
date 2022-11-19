import { Repository } from 'typeorm';

import { dataSource } from '@config/data_source';

import CreateUserDTO from '@modules/users/dtos/CreateUserDTO';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import CountResultDTO from '@modules/users/dtos/CountResultDTO';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = dataSource.getRepository(User);
  }

  public async findByLogin(login: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: {
        login,
      },
    });
    return user ?? undefined;
  }

  public async findById(userId: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { id: userId } });
    return user ?? undefined;
  }

  public async findAll(): Promise<User[]> {
    const users = await this.ormRepository.find();
    return users;
  }

  public async count(): Promise<CountResultDTO> {
    const count = await this.ormRepository.count();
    return { count };
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
