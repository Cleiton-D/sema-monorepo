import { inject, injectable } from 'tsyringe';

import Attendance from '../infra/typeorm/entities/Attendance';
import IAttendancesRepository from '../repositories/IAttendancesRepository';

type ListAttendancesRequest = {
  class_id?: string | 'all';
  classroom_id?: string;
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
  }: ListAttendancesRequest): Promise<Attendance[]> {
    const attendances = await this.attendancesRepository.findAll({
      class_id: class_id === 'all' ? undefined : class_id,
      classroom_id,
    });
    return attendances;
  }
}

export default ListAttendancesService;
