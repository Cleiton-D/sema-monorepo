import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Grade from '../infra/typeorm/entities/Grade';
import IGradesRepository from '../repositories/IGradesRepository';

type ShowGradeRequest = {
  id: string;
};

@injectable()
class ShowGradeService {
  constructor(
    @inject('GradesRepository') private gradesRepository: IGradesRepository,
  ) {}

  public async execute({ id }: ShowGradeRequest): Promise<Grade> {
    const grade = await this.gradesRepository.findById(id);
    if (!grade) {
      throw new AppError('Grade not found');
    }

    return grade;
  }
}

export default ShowGradeService;
