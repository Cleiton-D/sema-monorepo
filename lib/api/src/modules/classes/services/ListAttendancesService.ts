import { inject, injectable } from 'tsyringe';

import Attendance from '../infra/typeorm/entities/Attendance';
import IAttendancesRepository from '../repositories/IAttendancesRepository';

export type ListAttendancesRequest = {
  class_id?: string | string[] | 'all';
  classroom_id?: string;
  enroll_id?: string;
  attendance?: boolean;
};

@injectable()
class ListAttendancesService {
  constructor(
    @inject('AttendancesRepository')
    private attendancesRepository: IAttendancesRepository,
  ) {}

  public async execute({
    class_id,
    classroom_id,
    enroll_id,
    attendance,
  }: ListAttendancesRequest): Promise<Attendance[]> {
    const attendances = await this.attendancesRepository.findAll({
      class_id: class_id === 'all' ? undefined : class_id,
      classroom_id,
      enroll_id,
      attendance,
    });
    return attendances;
  }
}

export default ListAttendancesService;
