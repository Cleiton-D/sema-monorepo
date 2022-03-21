import EmployeeContact from '../infra/typeorm/entities/EmployeeContact';

export default interface IEmployeeContactsRepository {
  removeMany: (data: EmployeeContact[]) => Promise<void>;
}
