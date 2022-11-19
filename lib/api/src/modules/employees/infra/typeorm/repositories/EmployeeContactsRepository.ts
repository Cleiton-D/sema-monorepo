import { Repository } from 'typeorm';

import { dataSource } from '@config/data_source';

import IEmployeeContactsRepository from '@modules/employees/repositories/IEmployeeContactsRepository';
import EmployeeContact from '../entities/EmployeeContact';

class EmployeeContactsRepository implements IEmployeeContactsRepository {
  private ormRepository: Repository<EmployeeContact>;

  constructor() {
    this.ormRepository = dataSource.getRepository(EmployeeContact);
  }

  public async removeMany(employee_contacts: EmployeeContact[]): Promise<void> {
    await this.ormRepository.remove(employee_contacts);
  }
}

export default EmployeeContactsRepository;
