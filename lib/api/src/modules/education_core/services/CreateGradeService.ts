import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Grade from '../infra/typeorm/entities/Grade';

import IGradesRepository from '../repositories/IGradesRepository';

type CreateGradeRequest = {
  description: string;
  after_of?: string;
};

@injectable()
class CreateGradeService {
  constructor(
    @inject('GradesRepository') private gradesRepository: IGradesRepository,
  ) {}

  public async execute({
    description,
    after_of,
  }: CreateGradeRequest): Promise<Grade> {
    if (after_of) {
      const existAfterOf = await this.gradesRepository.findWithAfterOf(
        after_of,
      );

      if (existAfterOf) {
        throw new AppError('Already exist an grade after this another grade');
      }
    }

    const grade = await this.gradesRepository.create({ description, after_of });
    return grade;
  }
}

export default CreateGradeService;
