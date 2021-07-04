import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IClassroomsRepository from '../repositories/IClassroomsRepository';

type DeleteClassroomRequest = {
  school_id: string;
  classroom_id: string;
};

@injectable()
class DeleteClassroomService {
  constructor(
    @inject('ClassroomsRepository')
    private classroomsRepository: IClassroomsRepository,
  ) {}

  public async execute({
    school_id,
    classroom_id,
  }: DeleteClassroomRequest): Promise<void> {
    const classroom = await this.classroomsRepository.findById(classroom_id);
    if (!classroom) {
      throw new AppError('Classroom not found');
    }

    if (classroom.school_id !== school_id) {
      throw new AppError('this classroom does not belong to this school');
    }

    await this.classroomsRepository.delete(classroom);
  }
}

export default DeleteClassroomService;
