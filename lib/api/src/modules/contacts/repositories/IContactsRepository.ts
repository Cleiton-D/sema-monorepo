import CreateContactDTO from '../dtos/CreateContactDTO';
import Contact from '../infra/typeorm/entities/Contact';

export default interface IContactsRepository {
  findById(contact_id: string): Promise<Contact | undefined>;
  findMany(data: string[]): Promise<Contact[]>;
  create(contact: CreateContactDTO): Promise<Contact>;
  createMany(data: CreateContactDTO[]): Promise<Contact[]>;
  remove(contact: Contact): Promise<void>;
  removeMany(contacts: Contact[]): Promise<void>;
}
