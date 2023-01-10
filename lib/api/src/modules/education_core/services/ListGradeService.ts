import { inject, injectable } from 'tsyringe';

import Grade from '../infra/typeorm/entities/Grade';
import IGradesRepository from '../repositories/IGradesRepository';

type ListGradeRequest = {
  school_year_id?: string;
};
@injectable()
class ListGradeService {
  constructor(
    @inject('GradesRepository') private gradesRepository: IGradesRepository,
  ) {}

  public async execute({ school_year_id }: ListGradeRequest): Promise<Grade[]> {
    const grade = await this.gradesRepository.findAll({ school_year_id });
    return grade;
  }
}

export default ListGradeService;
