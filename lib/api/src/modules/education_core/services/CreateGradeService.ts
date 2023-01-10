import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Grade from '../infra/typeorm/entities/Grade';

import IGradesRepository from '../repositories/IGradesRepository';

type CreateGradeRequest = {
  description: string;
  after_of?: string;
  school_year_id?: string;
};

@injectable()
class CreateGradeService {
  constructor(
    @inject('GradesRepository') private gradesRepository: IGradesRepository,
  ) {}

  public async execute({
    description,
    after_of,
    school_year_id,
  }: CreateGradeRequest): Promise<Grade> {
    if (after_of) {
      const existAfterOf = await this.gradesRepository.findWithAfterOf(
        after_of,
      );

      if (existAfterOf) {
        throw new AppError('Already exist an grade after this another grade');
      }
    }

    const grade = await this.gradesRepository.create({
      description,
      after_of,
      school_year_id,
    });

    return grade;
  }
}

export default CreateGradeService;
