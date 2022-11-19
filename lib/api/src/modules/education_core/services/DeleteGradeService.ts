import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IClassroomsRepository from '@modules/schools/repositories/IClassroomsRepository';
import IGradesRepository from '../repositories/IGradesRepository';

type DeleteGradeRequest = {
  grade_id: string;
};

@injectable()
class DeleteGradeService {
  constructor(
    @inject('GradesRepository') private gradesRepository: IGradesRepository,
    @inject('ClassroomsRepository')
    private classroomsRepository: IClassroomsRepository,
  ) {}

  public async execute({ grade_id }: DeleteGradeRequest): Promise<void> {
    const grade = await this.gradesRepository.findById(grade_id);
    if (!grade) {
      throw new AppError('Grade not found');
    }

    const classrooms = await this.classroomsRepository.findAll({
      grade_id,
    });
    if (classrooms.total > 0) {
      throw new AppError(
        'Exists classrooms linked with this grade. Cannot delete',
      );
    }

    await this.gradesRepository.delete(grade);
  }
}

export default DeleteGradeService;
