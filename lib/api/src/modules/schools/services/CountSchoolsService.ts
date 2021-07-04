import { inject, injectable } from 'tsyringe';
import ISchoolsRepository from '../repositories/ISchoolsRepository';

type CountSchoolsResponse = {
  count: number;
};

@injectable()
class CountSchoolsService {
  constructor(
    @inject('SchoolsRepository') private schoolsRepository: ISchoolsRepository,
  ) {}

  public async execute(): Promise<CountSchoolsResponse> {
    const { count } = await this.schoolsRepository.count();
    return { count };
  }
}

export default CountSchoolsService;
