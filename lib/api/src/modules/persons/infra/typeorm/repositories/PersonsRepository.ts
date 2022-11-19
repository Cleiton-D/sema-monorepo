import { Repository } from 'typeorm';

import { dataSource } from '@config/data_source';

import CreatePersonDTO from '@modules/persons/dtos/CreatePersonDTO';
import IPersonsRepository from '@modules/persons/repositories/IPersonsRepository';

import Person from '../entities/Person';

export default class PersonsRepository implements IPersonsRepository {
  private ormRepository: Repository<Person>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Person);
  }

  public async findById(person_id: string): Promise<Person | undefined> {
    const queryBuilder = this.ormRepository
      .createQueryBuilder('person')
      .select()
      .where({ id: person_id })
      .innerJoinAndSelect('person.person_contacts', 'person_contact')
      .innerJoinAndSelect('person_contact.contact', 'contact')
      .leftJoinAndSelect('person.address', 'address');

    const person = await queryBuilder.getOne();
    return person ?? undefined;
  }

  public async create({
    name,
    mother_name,
    dad_name,
    address,
    gender,
    birth_date,
    contacts,
    documents,
  }: CreatePersonDTO): Promise<Person> {
    const person_contacts = contacts.map(contact => ({ contact }));

    const person = this.ormRepository.create({
      name,
      mother_name,
      dad_name,
      gender,
      address,
      birth_date,
      documents,
      person_contacts,
    });

    await this.ormRepository.save(person);
    return person;
  }

  public async update(person: Person): Promise<Person> {
    await this.ormRepository.save(person);
    return person;
  }
}
