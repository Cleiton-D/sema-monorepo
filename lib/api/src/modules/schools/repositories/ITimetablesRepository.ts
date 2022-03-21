import Timetable from '../infra/typeorm/entities/Timetable';

import FindTimetableDTO from '../dtos/FindTimetableDTO';
import CreateTimetableDTO from '../dtos/CreateTimetableDTO';

export default interface ITimetablesRepository {
  findAll: (filters?: FindTimetableDTO) => Promise<Timetable[]>;
  findOne: (filters: FindTimetableDTO) => Promise<Timetable | undefined>;
  createMany: (timetables: CreateTimetableDTO[]) => Promise<Timetable[]>;
  updateMany: (timetables: Timetable[]) => Promise<Timetable[]>;
  deleteMany: (timetables: Timetable[]) => Promise<void>;
}
