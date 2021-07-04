import FindEnrollClassroomDTO from '../dtos/FindEnrollClassroomDTO';
import EnrollClassroom from '../infra/typeorm/entities/EnrollClassroom';

export default interface IEnrollClassroomsRepository {
  findAll: (filters: FindEnrollClassroomDTO) => Promise<EnrollClassroom[]>;
}
