import CountResultDTO from '../dtos/CountResultDTO';
import CreateSchoolSubjectDTO from '../dtos/CreateSchoolSubjectDTO';
import FindSchoolSubjectDTO from '../dtos/FindSchoolSubjectDTO';
import SchoolSubject from '../infra/typeorm/entities/SchoolSubject';

export default interface ISchoolSubjectsRepository {
  findByid: (school_subject_id: string) => Promise<SchoolSubject | undefined>;
  findOne: (
    filters?: FindSchoolSubjectDTO,
  ) => Promise<SchoolSubject | undefined>;
  findAll: (filters?: FindSchoolSubjectDTO) => Promise<SchoolSubject[]>;
  count: (filters?: FindSchoolSubjectDTO) => Promise<CountResultDTO>;
  create: (data: CreateSchoolSubjectDTO) => Promise<SchoolSubject>;
  update: (schoolSubject: SchoolSubject) => Promise<SchoolSubject>;
  delete: (schoolSubject: SchoolSubject) => Promise<void>;
}
