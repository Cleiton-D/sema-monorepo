import CreateAttendanceDTO from '../dtos/CreateAttendanceDTO';
import FindAttendanceDTO from '../dtos/FindAttendanceDTO';
import Attendance from '../infra/typeorm/entities/Attendance';

export default interface IAttendancesRepository {
  findAll: (filters: FindAttendanceDTO) => Promise<Attendance[]>;
  createMany: (data: CreateAttendanceDTO[]) => Promise<Attendance[]>;
  updateMany: (attendances: Attendance[]) => Promise<Attendance[]>;
}
