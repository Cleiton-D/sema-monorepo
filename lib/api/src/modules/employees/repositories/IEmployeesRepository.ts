import CountResultDTO from '../dtos/CountResultDTO';
import CreateEmployeeDTO from '../dtos/CreateEmployeeDTO';
import FindEmployeeDTO from '../dtos/FindEmployeesDTO';
import Employee from '../infra/typeorm/entities/Employee';

export default interface IEmployeesRepository {
  findOne: (filters: FindEmployeeDTO) => Promise<Employee | undefined>;
  findAll: (filters: FindEmployeeDTO) => Promise<Employee[]>;
  count: () => Promise<CountResultDTO>;
  create: (data: CreateEmployeeDTO) => Promise<Employee>;
  update: (data: Employee) => Promise<Employee>;
  delete: (data: Employee) => Promise<void>;
}
