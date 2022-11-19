import { Repository } from 'typeorm';

import { dataSource } from '@config/data_source';

import IStudentContactsRepository from '@modules/students/repositories/IStudentContactsRepository';
import StudentContact from '../entities/StudentContact';

class StudentContactsRepository implements IStudentContactsRepository {
  private ormRepository: Repository<StudentContact>;

  constructor() {
    this.ormRepository = dataSource.getRepository(StudentContact);
  }

  public async removeMany(employee_contacts: StudentContact[]): Promise<void> {
    await this.ormRepository.remove(employee_contacts);
  }
}

export default StudentContactsRepository;
