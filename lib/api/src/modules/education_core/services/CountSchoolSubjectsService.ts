import { inject, injectable } from 'tsyringe';

import ISchoolSubjectsRepository from '../repositories/ISchoolSubjectsRepository';

type CountSchoolSubjectsResponse = {
  count: number;
};

@injectable()
class CountSchoolSubjectsService {
  constructor(
    @inject('SchoolSubjectsRepository')
    private schoolSubjectsRepository: ISchoolSubjectsRepository,
  ) {}

  public async execute(): Promise<CountSchoolSubjectsResponse> {
    const { count } = await this.schoolSubjectsRepository.count();
    return { count };
  }
}

export default CountSchoolSubjectsService;
