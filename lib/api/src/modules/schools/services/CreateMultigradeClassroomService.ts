import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import MultigradeClassroom from '../infra/typeorm/entities/MultigradeClassroom';
import IMultigradesClassroomsRepository from '../repositories/IMultigradesClassroomsRepository';

type CreateMultigradeClassroomRequest = {
  owner_id: string;
  classroom_id: string;
};

@injectable()
class CreateMultigradeClassroomService {
  constructor(
    @inject('MultigradesClassroomsRepository')
    private multigradesClassroomsRepository: IMultigradesClassroomsRepository,
  ) {}

  public async execute({
    owner_id,
    classroom_id,
  }: CreateMultigradeClassroomRequest): Promise<MultigradeClassroom> {
    const multigradeClassroom = await this.multigradesClassroomsRepository.create(
      {
        owner_id,
        classroom_id,
      },
    );

    const finalMultigradeClassroom = await this.multigradesClassroomsRepository.findOne(
      {
        id: multigradeClassroom.id,
      },
    );
    if (!finalMultigradeClassroom) {
      throw new AppError('Internal server error', 500);
    }

    return finalMultigradeClassroom;
  }
}

export default CreateMultigradeClassroomService;
