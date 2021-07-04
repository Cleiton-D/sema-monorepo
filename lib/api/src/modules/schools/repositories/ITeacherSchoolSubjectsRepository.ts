import TeacherSchoolSubject from '../infra/typeorm/entities/TeacherSchoolSubject';

import CreateTeacherSchoolSubjectDTO from '../dtos/CreateTeacherSchoolSubjectDTO';
import FindTeacherSchoolSubjectDTO from '../dtos/FindTeacherSchoolSubjectDTO';

export default interface ITeacherSchoolSubjectsRepository {
  findById: (
    teacher_school_subject_id: string,
  ) => Promise<TeacherSchoolSubject | undefined>;
  findAll: (
    filters: FindTeacherSchoolSubjectDTO,
  ) => Promise<TeacherSchoolSubject[]>;
  create: (
    data: CreateTeacherSchoolSubjectDTO,
  ) => Promise<TeacherSchoolSubject>;
  createMany: (
    data: CreateTeacherSchoolSubjectDTO[],
  ) => Promise<TeacherSchoolSubject[]>;
  delete: (teacherSchoolSubject: TeacherSchoolSubject) => Promise<void>;
}
