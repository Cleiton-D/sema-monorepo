import Timetable from '../infra/typeorm/entities/Timetable';

export default interface ITimetablesRepository {
  findById: (timetable_id: string) => Promise<Timetable | undefined>;
  findByIds: (timetable_ids: string[]) => Promise<Timetable[]>;
  updateMany: (timetables: Timetable[]) => Promise<Timetable[]>;
}
