import { Repository, In } from 'typeorm';

import { dataSource } from '@config/data_source';

import IContactsRepository from '@modules/contacts/repositories/IContactsRepository';
import Contact from '../entities/Contact';

import CreateContactDTO from '../../../dtos/CreateContactDTO';

export default class ContactsRepository implements IContactsRepository {
  private ormRepository: Repository<Contact>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Contact);
  }

  public async findById(contact_id: string): Promise<Contact | undefined> {
    const contact = await this.ormRepository.findOne({
      where: { id: contact_id },
    });
    return contact ?? undefined;
  }

  public async findMany(contacts_ids: string[]): Promise<Contact[]> {
    const contacts = await this.ormRepository.find({
      where: { id: In(contacts_ids) },
    });

    return contacts;
  }

  public async create({
    description,
    type,
  }: CreateContactDTO): Promise<Contact> {
    const contact = this.ormRepository.create({ description, type });
    await this.ormRepository.save(contact);
    return contact;
  }

  public async createMany(data: CreateContactDTO[]): Promise<Contact[]> {
    const contacts = data.map(({ type, description }) =>
      this.ormRepository.create({ type, description }),
    );

    await this.ormRepository.save(contacts);

    return contacts;
  }

  public async remove(contact: Contact): Promise<void> {
    await this.ormRepository.remove(contact);
  }

  public async removeMany(contacts: Contact[]): Promise<void> {
    await this.ormRepository.remove(contacts);
  }
}
