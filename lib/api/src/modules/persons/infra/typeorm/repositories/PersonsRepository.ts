import { getRepository, Repository } from 'typeorm';

import CreatePersonDTO from '@modules/persons/dtos/CreatePersonDTO';
import IPersonsRepository from '@modules/persons/repositories/IPersonsRepository';

import Person from '../entities/Person';

export default class PersonsRepository implements IPersonsRepository {
  private ormRepository: Repository<Person>;

  constructor() {
    this.ormRepository = getRepository(Person);
  }

  public async findById(person_id: string): Promise<Person | undefined> {
    const person = await this.ormRepository.findOne({
      where: { id: person_id },
      relations: ['address'],
      join: {
        alias: 'person',
        innerJoinAndSelect: {
          person_contact: 'person.person_contacts',
          contact: 'person_contact.contact',
        },
      },
    });
    return person;
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
