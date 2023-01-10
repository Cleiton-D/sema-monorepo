import { inject, injectable } from 'tsyringe';

import IGradesRepository from '../repositories/IGradesRepository';

type CountGradesRequest = {
  school_year_id?: string;
};

type CountGradesResponse = {
  count: number;
};

@injectable()
class CountGradesService {
  constructor(
    @inject('GradesRepository') private gradesRepository: IGradesRepository,
  ) {}

  public async execute({
    school_year_id,
  }: CountGradesRequest): Promise<CountGradesResponse> {
    const { count } = await this.gradesRepository.count({ school_year_id });
    return { count };
  }
}

export default CountGradesService;
