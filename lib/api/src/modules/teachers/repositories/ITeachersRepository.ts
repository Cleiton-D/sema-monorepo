import Employee from '@modules/employees/infra/typeorm/entities/Employee';

import FindTeacherDTO from '../dtos/FindTeacherDTO';

export default interface ITeachersRepository {
  findAll: (filters: FindTeacherDTO) => Promise<Employee[]>;
}
