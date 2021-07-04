import CreateUserDTO from '../dtos/CreateUserDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
  findByLogin: (login: string) => Promise<User | undefined>;
  findById: (userId: string) => Promise<User | undefined>;
  findAll: () => Promise<User[]>;
  create: (data: CreateUserDTO) => Promise<User>;
  update: (user: User) => Promise<User>;
  delete: (user: User) => Promise<void>;
}
