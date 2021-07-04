import { inject, injectable } from 'tsyringe';
import { EnrollStatus } from '../infra/typeorm/entities/Enroll';

import IEnrollsRepository from '../repositories/IEnrollsRepository';

type CountEnrollsRequest = {
  status?: EnrollStatus;
  school_id?: string;
  grade_id?: string;
  school_year_id?: string;
};

type CountEnrollsResponse = {
  count: number;
};

@injectable()
class CountEnrollsService {
  constructor(
    @inject('EnrollsRepository') private enrollsRepository: IEnrollsRepository,
  ) {}

  public async execute({
    grade_id,
    school_id,
    school_year_id,
    status,
  }: CountEnrollsRequest): Promise<CountEnrollsResponse> {
    const { enroll_count } = await this.enrollsRepository.count({
      grade_id,
      school_id,
      school_year_id,
      status,
    });

    return { count: enroll_count };
  }
}

export default CountEnrollsService;
