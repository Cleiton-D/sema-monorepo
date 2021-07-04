import { inject, injectable } from 'tsyringe';

import IGradesRepository from '../repositories/IGradesRepository';

type CountGradesResponse = {
  count: number;
};

@injectable()
class CountGradesService {
  constructor(
    @inject('GradesRepository') private gradesRepository: IGradesRepository,
  ) {}

  public async execute(): Promise<CountGradesResponse> {
    const { count } = await this.gradesRepository.count();
    return { count };
  }
}

export default CountGradesService;
