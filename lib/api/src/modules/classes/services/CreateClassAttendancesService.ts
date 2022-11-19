import { inject, injectable } from 'tsyringe';

import IEnrollClassroomsRepository from '@modules/enrolls/repositories/IEnrollClassroomsRepository';

import Attendance from '../infra/typeorm/entities/Attendance';
import Class from '../infra/typeorm/entities/Class';
import IAttendancesRepository from '../repositories/IAttendancesRepository';

type CreateClassAttendancesRequest = {
  class: Class;
};

@injectable()
class CreateClassAttendancesService {
  constructor(
    @inject('EnrollClassroomsRepository')
    private enrollClassroomsRepository: IEnrollClassroomsRepository,
    @inject('AttendancesRepository')
    private attendancesRepository: IAttendancesRepository,
  ) {}

  public async execute({
    class: classEntity,
  }: CreateClassAttendancesRequest): Promise<Attendance[]> {
    const enrollClassrooms = await this.enrollClassroomsRepository.findAll({
      classroom_id: classEntity.classroom_id,
      status: 'ACTIVE',
    });

    const createAttendances = enrollClassrooms.map(item => ({
      enroll_id: item.enroll_id,
      enroll_classroom_id: item.id,
      class_id: classEntity.id,
      attendance: true,
    }));

    const attendances = await this.attendancesRepository.createMany(
      createAttendances,
    );

    return attendances;
  }
}

export default CreateClassAttendancesService;
