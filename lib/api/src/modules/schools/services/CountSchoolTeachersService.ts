import { inject, injectable } from 'tsyringe';

import ISchoolTeachersRepository from '../repositories/ISchoolTeachersRepository';

type CountSchoolTeachersRequest = {
  school_id?: string;
  school_year_id?: string;
};

type CountSchoolTeachersResponse = {
  count: number;
};

@injectable()
class CountSchoolTeachersService {
  constructor(
    @inject('SchoolTeachersRepository')
    private schoolTeachersRepository: ISchoolTeachersRepository,
  ) {}

  public async execute({
    school_id,
    school_year_id,
  }: CountSchoolTeachersRequest): Promise<CountSchoolTeachersResponse> {
    const { count } = await this.schoolTeachersRepository.count({
      school_id,
      school_year_id,
    });

    return { count };
  }
}

export default CountSchoolTeachersService;
