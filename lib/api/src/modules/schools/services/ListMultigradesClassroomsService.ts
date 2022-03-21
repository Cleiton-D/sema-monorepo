import { inject, injectable } from 'tsyringe';

import MultigradeClassroom from '../infra/typeorm/entities/MultigradeClassroom';
import IMultigradesClassroomsRepository from '../repositories/IMultigradesClassroomsRepository';

type ListMultigradesClassroomsRequest = {
  owner_id: string;
};

@injectable()
class ListMultigradesClassroomsService {
  constructor(
    @inject('MultigradesClassroomsRepository')
    private multigradesClassroomsRepository: IMultigradesClassroomsRepository,
  ) {}

  public async execute({
    owner_id,
  }: ListMultigradesClassroomsRequest): Promise<MultigradeClassroom[]> {
    const multigradeClassrooms = await this.multigradesClassroomsRepository.findAll(
      {
        owner_id,
      },
    );

    return multigradeClassrooms;
  }
}

export default ListMultigradesClassroomsService;
