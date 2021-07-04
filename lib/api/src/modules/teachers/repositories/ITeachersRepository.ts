import CreateTeacherDTO from '../dtos/CreateTeacherDTO';
import Teacher from '../infra/typeorm/entities/Teacher';

export default interface ITeachersRepository {
  findById: (teacher_id: string) => Promise<Teacher | undefined>;
  findByEmployee: (employee_id: string) => Promise<Teacher | undefined>;
  create: (data: CreateTeacherDTO) => Promise<Teacher>;
}
