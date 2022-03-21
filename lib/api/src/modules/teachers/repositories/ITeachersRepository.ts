import Employee from '@modules/employees/infra/typeorm/entities/Employee';

export default interface ITeachersRepository {
  findAll: () => Promise<Employee[]>;
}
