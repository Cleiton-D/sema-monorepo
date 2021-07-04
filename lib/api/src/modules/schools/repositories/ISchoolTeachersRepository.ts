import CountResultDTO from '../dtos/CountResultDTO';
import CreateSchoolTeacherDTO from '../dtos/CreateSchoolTeacherDTO';
import FindSchoolTeacherDTO from '../dtos/FindSchoolTeacherDTO';
import SchoolTeacher from '../infra/typeorm/entities/SchoolTeacher';

export default interface ISchoolTeachersRepository {
  findOne: (
    filters: FindSchoolTeacherDTO,
  ) => Promise<SchoolTeacher | undefined>;
  findAll: (filters: FindSchoolTeacherDTO) => Promise<SchoolTeacher[]>;
  count: (filters: FindSchoolTeacherDTO) => Promise<CountResultDTO>;
  create: (data: CreateSchoolTeacherDTO) => Promise<SchoolTeacher>;
  delete: (schoolTeacher: SchoolTeacher) => Promise<void>;
}
