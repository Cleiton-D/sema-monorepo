import Student from '../infra/typeorm/entities/Student';

import CreateStudentDTO from '../dtos/CreateStudentDTO';
import StudentFilterDTO from '../dtos/StudentFilterDTO';

export default interface IStudentsRepository {
  findById: (student_id: string) => Promise<Student | undefined>;
  findAll: (filters: StudentFilterDTO) => Promise<Student[]>;
  create: (data: CreateStudentDTO) => Promise<Student>;
  update: (student: Student) => Promise<Student>;
}
