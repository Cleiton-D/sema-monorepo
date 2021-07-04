import CreateClassroomTeacherSchoolSubjectDTO from '../dtos/CreateClassroomTeacherSchoolSubjectDTO';
import FindClassroomTeacherSchoolSubjectDTO from '../dtos/FindClassroomTeacherSchoolSubjectDTO';
import ClassroomTeacherSchoolSubject from '../infra/typeorm/entities/ClassroomTeacherSchoolSubject';

export default interface IClassroomTeacherSchoolSubjectsRepository {
  findOne: (
    filters: FindClassroomTeacherSchoolSubjectDTO,
  ) => Promise<ClassroomTeacherSchoolSubject | undefined>;
  findAll: (
    filters: FindClassroomTeacherSchoolSubjectDTO,
  ) => Promise<ClassroomTeacherSchoolSubject[]>;
  create: (
    data: CreateClassroomTeacherSchoolSubjectDTO,
  ) => Promise<ClassroomTeacherSchoolSubject>;
  createMany: (
    data: CreateClassroomTeacherSchoolSubjectDTO[],
  ) => Promise<ClassroomTeacherSchoolSubject[]>;
  delete: (
    classroomTeacherSchoolSubject: ClassroomTeacherSchoolSubject,
  ) => Promise<void>;
  deleteMany: (
    classroomTeacherSchoolSubject: ClassroomTeacherSchoolSubject[],
  ) => Promise<void>;
}
