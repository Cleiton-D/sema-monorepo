import {
  CountAttendancesDTO,
  CountAttendancesResponse,
} from '../dtos/CountAttendancesDTO';
import CreateAttendanceDTO from '../dtos/CreateAttendanceDTO';
import FindAttendanceDTO from '../dtos/FindAttendanceDTO';
import Attendance from '../infra/typeorm/entities/Attendance';

export default interface IAttendancesRepository {
  findAll: (filters: FindAttendanceDTO) => Promise<Attendance[]>;
  count: (filters: CountAttendancesDTO) => Promise<CountAttendancesResponse[]>;
  createMany: (data: CreateAttendanceDTO[]) => Promise<Attendance[]>;
  updateMany: (attendances: Attendance[]) => Promise<Attendance[]>;
}
