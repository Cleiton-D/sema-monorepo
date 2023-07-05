import { inject, injectable } from 'tsyringe';

import IEnrollClassroomsRepository from '@modules/enrolls/repositories/IEnrollClassroomsRepository';

import AppError from '@shared/errors/AppError';

import Attendance from '../infra/typeorm/entities/Attendance';
import IAttendancesRepository from '../repositories/IAttendancesRepository';
import IClassesRepository from '../repositories/IClassesRepository';

type AddClassAttendancesRequest = {
  class_id: string;
  enroll_classroom_id: string;
};

@injectable()
class AddClassAttendancesService {
  constructor(
    @inject('ClassesRepository') private classesRepository: IClassesRepository,
    @inject('EnrollClassroomsRepository')
    private enrollClassroomsRepository: IEnrollClassroomsRepository,
    @inject('AttendancesRepository')
    private attendancesRepository: IAttendancesRepository,
  ) {}

  public async execute({
    class_id,
    enroll_classroom_id,
  }: AddClassAttendancesRequest): Promise<Attendance[]> {
    const classEntity = await this.classesRepository.findOne({ id: class_id });
    if (!classEntity) {
      throw new AppError('Class not found');
    }

    const enrollClassroom = await this.enrollClassroomsRepository.findOne({
      classroom_id: classEntity.classroom_id,
      id: enroll_classroom_id,
      status: 'ACTIVE',
    });
    if (!enrollClassroom) {
      throw new AppError('Enroll classroom not found');
    }

    const existent = await this.attendancesRepository.findOne({
      class_id,
      enroll_id: enrollClassroom.enroll_id,
    });
    if (existent) {
      throw new AppError('Attendance already exists');
    }

    const attendances = await this.attendancesRepository.createMany([
      {
        enroll_id: enrollClassroom.enroll_id,
        enroll_classroom_id: enrollClassroom.id,
        class_id: classEntity.id,
        attendance: true,
      },
    ]);

    return attendances;
  }
}

export default AddClassAttendancesService;
