import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

import IMultigradesClassroomsRepository from '../repositories/IMultigradesClassroomsRepository';

type DeleteMultigradeClassroomRequest = {
  multigrade_classroom_id: string;
};

@injectable()
class DeleteMultigradeClassroomService {
  constructor(
    @inject('MultigradesClassroomsRepository')
    private multigradesClassroomsRepository: IMultigradesClassroomsRepository,
  ) {}

  public async execute({
    multigrade_classroom_id,
  }: DeleteMultigradeClassroomRequest): Promise<void> {
    const multigradeClassroom = await this.multigradesClassroomsRepository.findOne(
      {
        id: multigrade_classroom_id,
      },
    );
    if (!multigradeClassroom) {
      throw new AppError('MultigradeClassroom not found');
    }

    await this.multigradesClassroomsRepository.delete(multigradeClassroom);
  }
}

export default DeleteMultigradeClassroomService;
