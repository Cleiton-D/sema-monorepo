import Student from '../infra/typeorm/entities/Student';

import CreateStudentDTO from '../dtos/CreateStudentDTO';

export default interface IStudentsRepository {
  findById: (student_id: string) => Promise<Student | undefined>;
  create: (data: CreateStudentDTO) => Promise<Student>;
  update: (student: Student) => Promise<Student>;
}
