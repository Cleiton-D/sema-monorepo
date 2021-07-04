import CountResultDTO from '../dtos/CountResultDTO';
import CreateSchoolSubjectDTO from '../dtos/CreateSchoolSubjectDTO';
import SchoolSubject from '../infra/typeorm/entities/SchoolSubject';

export default interface ISchoolSubjectsRepository {
  findByid: (school_subject_id: string) => Promise<SchoolSubject | undefined>;
  findAll: () => Promise<SchoolSubject[]>;
  count: () => Promise<CountResultDTO>;
  create: (data: CreateSchoolSubjectDTO) => Promise<SchoolSubject>;
  update: (schoolSubject: SchoolSubject) => Promise<SchoolSubject>;
  delete: (schoolSubject: SchoolSubject) => Promise<void>;
}
