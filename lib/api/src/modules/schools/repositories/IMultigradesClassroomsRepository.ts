import CreateMultigradeClassroomDTO from '../dtos/CreateMultigradeClassroomDTO';
import FindMultigradeClassroomDTO from '../dtos/FindMultigradeClassroomDTO';
import MultigradeClassroom from '../infra/typeorm/entities/MultigradeClassroom';

export default interface IMultigradesClassroomsRepository {
  findOne: (
    filters: FindMultigradeClassroomDTO,
  ) => Promise<MultigradeClassroom | undefined>;
  findAll: (
    filters: FindMultigradeClassroomDTO,
  ) => Promise<MultigradeClassroom[]>;
  create: (data: CreateMultigradeClassroomDTO) => Promise<MultigradeClassroom>;
  delete: (multigradeClassroom: MultigradeClassroom) => Promise<void>;
}
