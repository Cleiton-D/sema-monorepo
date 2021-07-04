import Class from '../infra/typeorm/entities/Class';

import CountResultDTO from '../dtos/CountResultDTO';
import CreateClassDTO from '../dtos/CreateClassDTO';
import FindClassDTO from '../dtos/FindClassDTO';

export default interface IClassesRepository {
  findById: (class_id: string) => Promise<Class | undefined>;
  findAll: (filters: FindClassDTO) => Promise<Class[]>;
  count: (filters: FindClassDTO) => Promise<CountResultDTO>;
  create: (data: CreateClassDTO) => Promise<Class>;
  update: (classEntity: Class) => Promise<Class>;
}
