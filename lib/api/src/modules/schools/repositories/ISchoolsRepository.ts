import CreateSchoolDTO from '../dtos/CreateSchoolDTO';
import School from '../infra/typeorm/entities/School';
import FindSchoolsDTO from '../dtos/FindSchoolsDTO';
import CountResultDTO from '../dtos/CountResultDTO';

export default interface ISchoolsRepository {
  findOne: (filters: FindSchoolsDTO) => Promise<School | undefined>;
  findAll: () => Promise<School[]>;
  findWithEnrolls: () => Promise<School[]>;
  count: () => Promise<CountResultDTO>;
  create: (data: CreateSchoolDTO) => Promise<School>;
  update: (school: School) => Promise<School>;
}
