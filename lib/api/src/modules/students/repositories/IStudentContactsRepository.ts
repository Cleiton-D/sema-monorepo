import StudentContact from '../infra/typeorm/entities/StudentContact';

export default interface IStudentContactsRepository {
  removeMany: (data: StudentContact[]) => Promise<void>;
}
