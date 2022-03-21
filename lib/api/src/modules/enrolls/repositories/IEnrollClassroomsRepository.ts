import CreateEnrollClassroomDTO from '../dtos/CreateEnrollClassroomDTO';
import FindEnrollClassroomDTO from '../dtos/FindEnrollClassroomDTO';
import EnrollClassroom from '../infra/typeorm/entities/EnrollClassroom';

export default interface IEnrollClassroomsRepository {
  findOne: (
    filters: FindEnrollClassroomDTO,
  ) => Promise<EnrollClassroom | undefined>;
  findAll: (filters: FindEnrollClassroomDTO) => Promise<EnrollClassroom[]>;
  create: (data: CreateEnrollClassroomDTO) => Promise<EnrollClassroom>;
  update: (enrollClassroom: EnrollClassroom) => Promise<EnrollClassroom>;
}
