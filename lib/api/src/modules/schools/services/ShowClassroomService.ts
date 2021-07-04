import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Classroom from '../infra/typeorm/entities/Classroom';
import IClassroomsRepository from '../repositories/IClassroomsRepository';

type ShowClassroomRequest = {
  classroom_id: string;
};

@injectable()
class ShowClassroomService {
  constructor(
    @inject('ClassroomsRepository')
    private classroomsRepository: IClassroomsRepository,
  ) {}

  public async execute({
    classroom_id,
  }: ShowClassroomRequest): Promise<Classroom> {
    const classroom = await this.classroomsRepository.findById(classroom_id);
    if (!classroom) {
      throw new AppError('Classroom not found');
    }

    return classroom;
  }
}

export default ShowClassroomService;
