import { getRepository, Repository } from 'typeorm';

import IPersonContactsRepository from '@modules/persons/repositories/IPersonContactsRepository';
import PersonContact from '../entities/PersonContact';

class PersonContactsRepository implements IPersonContactsRepository {
  private ormRepository: Repository<PersonContact>;

  constructor() {
    this.ormRepository = getRepository(PersonContact);
  }

  public async removeMany(person_contacts: PersonContact[]): Promise<void> {
    await this.ormRepository.remove(person_contacts);
  }
}

export default PersonContactsRepository;
