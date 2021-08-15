import { inject, injectable } from 'tsyringe';
import { ClassPeriodType } from '../infra/typeorm/entities/Classroom';

import IClassroomsRepository from '../repositories/IClassroomsRepository';

type CountClassroomsRequest = {
  class_period?: ClassPeriodType;
  school_id?: string;
  grade_id?: string;
  school_year_id?: string;
};

type CountClassroomsResponse = {
  count: number;
};

@injectable()
class CountClassroomsService {
  constructor(
    @inject('ClassroomsRepository')
    private classroomsRepository: IClassroomsRepository,
  ) {}

  public async execute({
    class_period,
    grade_id,
    school_id,
    school_year_id,
  }: CountClassroomsRequest): Promise<CountClassroomsResponse> {
    const { count } = await this.classroomsRepository.count({
      class_period,
      grade_id,
      school_id,
      school_year_id,
    });

    return { count };
  }
}

export default CountClassroomsService;
