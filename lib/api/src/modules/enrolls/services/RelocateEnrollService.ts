import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IClassroomsRepository from '@modules/schools/repositories/IClassroomsRepository';
import Enroll from '../infra/typeorm/entities/Enroll';
import IEnrollsRepository from '../repositories/IEnrollsRepository';
import IEnrollClassroomsRepository from '../repositories/IEnrollClassroomsRepository';
import EnrollClassroom from '../infra/typeorm/entities/EnrollClassroom';

type RelocateEnrollRequest = {
  enroll_id: string;
  from?: string;
  to: string;
};

@injectable()
class RelocateEnrollService {
  constructor(
    @inject('EnrollsRepository') private enrollsRepository: IEnrollsRepository,
    @inject('EnrollClassroomsRepository')
    private enrollClassroomsRepository: IEnrollClassroomsRepository,
    @inject('ClassroomsRepository')
    private classroomsRepository: IClassroomsRepository,
  ) {}

  public async execute({
    enroll_id,
    from,
    to,
  }: RelocateEnrollRequest): Promise<Enroll> {
    const enroll = await this.enrollsRepository.findOne({
      id: enroll_id,
    });
    if (!enroll) {
      throw new AppError('Enroll not found', 404);
    }

    const toClassroom = await this.classroomsRepository.findById(to);
    if (!toClassroom) {
      throw new AppError('Classroom not found', 404);
    }

    const currentEnrollClassroom = await this.getCurrentEnrollClassroom(
      enroll.id,
      from,
    );

    const alreadyEnrollClassroom = await this.enrollClassroomsRepository.findOne(
      {
        classroom_id: to,
        enroll_id: enroll.id,
      },
    );
    if (alreadyEnrollClassroom) {
      Object.assign(alreadyEnrollClassroom, {
        status: 'ACTIVE',
      });
      await this.enrollClassroomsRepository.update(alreadyEnrollClassroom);
    } else {
      await this.enrollClassroomsRepository.create({
        classroom_id: to,
        enroll_id,
        status: 'ACTIVE',
      });
    }

    if (currentEnrollClassroom) {
      Object.assign(currentEnrollClassroom, { status: 'RELOCATED' });
      await this.enrollClassroomsRepository.update(currentEnrollClassroom);
    }

    const newEnroll = Object.assign(enroll, {
      class_period_id: toClassroom.class_period_id,
      class_period: toClassroom.class_period,
    });
    return this.enrollsRepository.update(newEnroll);
  }

  private async getCurrentEnrollClassroom(
    enroll_id: string,
    from?: string,
  ): Promise<EnrollClassroom | undefined> {
    if (!from) return undefined;

    const currentEnrollClassroom = await this.enrollClassroomsRepository.findOne(
      {
        classroom_id: from,
        enroll_id,
        status: 'ACTIVE',
      },
    );
    if (!currentEnrollClassroom) {
      throw new AppError('from classroom not found to this enroll');
    }

    return currentEnrollClassroom;
  }
}

export default RelocateEnrollService;
