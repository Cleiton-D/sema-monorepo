import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IClassroomsRepository from '../repositories/IClassroomsRepository';

type DeleteClassroomRequest = {
  classroom_id: string;
};

@injectable()
class DeleteClassroomService {
  constructor(
    @inject('ClassroomsRepository')
    private classroomsRepository: IClassroomsRepository,
  ) {}

  public async execute({
    classroom_id,
  }: DeleteClassroomRequest): Promise<void> {
    const classroom = await this.classroomsRepository.findById(classroom_id);
    if (!classroom) {
      throw new AppError('Classroom not found');
    }

    await this.classroomsRepository.delete(classroom);
  }
}

export default DeleteClassroomService;
