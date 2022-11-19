import { PaginatedResponse } from '@shared/dtos';

import Class from '../infra/typeorm/entities/Class';

import CountResultDTO from '../dtos/CountResultDTO';
import CreateClassDTO from '../dtos/CreateClassDTO';
import FindClassDTO from '../dtos/FindClassDTO';

export default interface IClassesRepository {
  findOne: (filters: FindClassDTO) => Promise<Class | undefined>;
  findAll: (filters: FindClassDTO) => Promise<PaginatedResponse<Class>>;
  count: (filters: FindClassDTO) => Promise<CountResultDTO>;
  create: (data: CreateClassDTO) => Promise<Class>;
  update: (classEntity: Class) => Promise<Class>;
  delete: (classEntity: Class) => Promise<void>;
}
