import CreateGradeSchoolSubjectDTO from '../dtos/CreateGradeSchoolSubjectDTO';
import FindGradeSchoolSubjectDTO from '../dtos/FindGradeSchoolSubjectDTO';
import GradeSchoolSubject from '../infra/typeorm/entities/GradeSchoolSubject';

export default interface IGradeSchoolSubjectsRepository {
  find: (filters: FindGradeSchoolSubjectDTO) => Promise<GradeSchoolSubject[]>;
  findOne: (
    filters: FindGradeSchoolSubjectDTO,
  ) => Promise<GradeSchoolSubject | undefined>;
  create: (data: CreateGradeSchoolSubjectDTO) => Promise<GradeSchoolSubject>;
  createMany: (
    data: CreateGradeSchoolSubjectDTO[],
  ) => Promise<GradeSchoolSubject[]>;
  update: (
    gradeSchoolSubject: GradeSchoolSubject,
  ) => Promise<GradeSchoolSubject>;
  delete: (gradeSchoolSubject: GradeSchoolSubject) => Promise<void>;
}
