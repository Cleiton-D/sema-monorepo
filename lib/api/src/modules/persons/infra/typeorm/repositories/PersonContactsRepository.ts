import { Repository } from 'typeorm';

import { dataSource } from '@config/data_source';

import IPersonContactsRepository from '@modules/persons/repositories/IPersonContactsRepository';
import PersonContact from '../entities/PersonContact';

class PersonContactsRepository implements IPersonContactsRepository {
  private ormRepository: Repository<PersonContact>;

  constructor() {
    this.ormRepository = dataSource.getRepository(PersonContact);
  }

  public async removeMany(person_contacts: PersonContact[]): Promise<void> {
    await this.ormRepository.remove(person_contacts);
  }
}

export default PersonContactsRepository;
