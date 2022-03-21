import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Enroll, { EnrollStatus } from '../infra/typeorm/entities/Enroll';
import IEnrollsRepository from '../repositories/IEnrollsRepository';
import IEnrollClassroomsRepository from '../repositories/IEnrollClassroomsRepository';

type UpdateEnrollRequest = {
  enroll_id: string;
  status: EnrollStatus;
};

@injectable()
class UpdateEnrollService {
  constructor(
    @inject('EnrollsRepository') private enrollsRepository: IEnrollsRepository,
    @inject('EnrollClassroomsRepository')
    private enrollClassroomsRepository: IEnrollClassroomsRepository,
  ) {}

  public async execute({
    enroll_id,
    status,
  }: UpdateEnrollRequest): Promise<Enroll> {
    const enroll = await this.enrollsRepository.findOne({ id: enroll_id });
    if (!enroll) {
      throw new AppError('Enroll not found', 404);
    }

    const currentStatus = enroll.status;
    const updatedEnroll = Object.assign(enroll, {
      status,
    });

    await this.enrollsRepository.update(updatedEnroll);

    if (currentStatus !== status) {
      const currentEnrollClassroom = await this.enrollClassroomsRepository.findOne(
        {
          enroll_id,
          status: 'ACTIVE',
        },
      );
      if (currentEnrollClassroom) {
        const updatedEnrollClassroom = Object.assign(currentEnrollClassroom, {
          status,
        });
        await this.enrollClassroomsRepository.update(updatedEnrollClassroom);
      }
    }

    return updatedEnroll;
  }
}

export default UpdateEnrollService;
