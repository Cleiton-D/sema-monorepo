import { inject, injectable } from 'tsyringe';

import ISchoolSubjectsRepository from '../repositories/ISchoolSubjectsRepository';

type CountSchoolSubjectsResponse = {
  count: number;
};

type CountSchoolSubjectsRequest = {
  school_year_id?: string;
};

@injectable()
class CountSchoolSubjectsService {
  constructor(
    @inject('SchoolSubjectsRepository')
    private schoolSubjectsRepository: ISchoolSubjectsRepository,
  ) {}

  public async execute({
    school_year_id,
  }: CountSchoolSubjectsRequest): Promise<CountSchoolSubjectsResponse> {
    const { count } = await this.schoolSubjectsRepository.count({
      school_year_id,
    });
    return { count };
  }
}

export default CountSchoolSubjectsService;
