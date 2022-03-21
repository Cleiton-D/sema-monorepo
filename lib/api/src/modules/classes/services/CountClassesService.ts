import { inject, injectable } from 'tsyringe';

import IClassesRepository from '../repositories/IClassesRepository';

type CountClassesRequest = {
  classroom_id?: string;
  school_subject_id?: string;
  employee_id?: string;
  school_id?: string;
};

type CountClassesResponse = {
  count: number;
};

@injectable()
class CountClassesService {
  constructor(
    @inject('ClassesRepository') private classesRepository: IClassesRepository,
  ) {}

  public async execute({
    classroom_id,
    employee_id,
    school_subject_id,
    school_id,
  }: CountClassesRequest): Promise<CountClassesResponse> {
    const { count } = await this.classesRepository.count({
      classroom_id,
      employee_id,
      school_subject_id,
      school_id,
    });

    return { count };
  }
}

export default CountClassesService;
