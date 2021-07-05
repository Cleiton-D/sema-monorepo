import { inject, injectable } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';

type CountUsersResponse = {
  count: number;
};

@injectable()
class CountUsersService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute(): Promise<CountUsersResponse> {
    const { count } = await this.usersRepository.count();
    return { count };
  }
}

export default CountUsersService;
