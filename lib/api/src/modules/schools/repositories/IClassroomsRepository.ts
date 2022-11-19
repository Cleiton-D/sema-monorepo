import { PaginatedResponse } from '@shared/dtos';

import CountResultDTO from '../dtos/CountResultDTO';
import CreateClassroomDTO from '../dtos/CreateClassroomDTO';
import FindClassroomsDTO from '../dtos/FindClassroomsDTO';
import Classroom from '../infra/typeorm/entities/Classroom';

export default interface IClassroomsRepository {
  findById: (classroom_id: string) => Promise<Classroom | undefined>;
  findAll: (
    filters: FindClassroomsDTO,
  ) => Promise<PaginatedResponse<Classroom>>;
  count: (filters: FindClassroomsDTO) => Promise<CountResultDTO>;
  create: (data: CreateClassroomDTO) => Promise<Classroom>;
  update: (classroom: Classroom) => Promise<Classroom>;
  delete: (classroom: Classroom) => Promise<void>;
}
