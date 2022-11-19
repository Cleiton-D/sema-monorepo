import { FindOptionsWhere, Repository } from 'typeorm';

import { dataSource } from '@config/data_source';

import ISchoolContactsRepository from '@modules/schools/repositories/ISchoolContactsRepository';
import FindSchoolContactDTO from '@modules/schools/dtos/FindSchoolContactDTO';

import SchoolContact from '../entities/SchoolContact';

class SchoolContactsRepository implements ISchoolContactsRepository {
  private ormRepository: Repository<SchoolContact>;

  constructor() {
    this.ormRepository = dataSource.getRepository(SchoolContact);
  }

  public async findAll({
    contact_id,
    school_id,
  }: FindSchoolContactDTO): Promise<SchoolContact[]> {
    const where: FindOptionsWhere<SchoolContact> = {};
    if (contact_id) where.contact_id = contact_id;
    if (school_id) where.school_id = school_id;

    const schoolContacts = await this.ormRepository.find({ where });
    return schoolContacts;
  }
}

export default SchoolContactsRepository;
