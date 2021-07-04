import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IGradesRepository from '../repositories/IGradesRepository';

type DeleteGradeRequest = {
  grade_id: string;
};

@injectable()
class DeleteGradeService {
  constructor(
    @inject('GradesRepository') private gradesRepository: IGradesRepository,
  ) {}

  public async execute({ grade_id }: DeleteGradeRequest): Promise<void> {
    const grade = await this.gradesRepository.findById(grade_id);
    if (!grade) {
      throw new AppError('Grade not found');
    }
    await this.gradesRepository.delete(grade);
  }
}

export default DeleteGradeService;
