import { injectable, inject } from 'tsyringe';

import Contact, { ContactType } from '../infra/typeorm/entities/Contact';
import IContactsRepository from '../repositories/IContactsRepository';

type ContactRequest = {
  description: string;
  type: ContactType;
};

type CreateContactsRequest = ContactRequest | ContactRequest[];

type CreateContactResponse<T> = T extends Array<ContactRequest>
  ? Contact[]
  : Contact;

@injectable()
export default class CreateContactService {
  contactsRepository: IContactsRepository;

  constructor(
    @inject('ContactsRepository') contactsRepository: IContactsRepository,
  ) {
    this.contactsRepository = contactsRepository;
  }

  public async execute<T extends CreateContactsRequest>(
    data: T,
  ): Promise<CreateContactResponse<T>> {
    if (Array.isArray(data)) {
      const contactDataArr = data.map(({ type, description }) => ({
        type,
        description,
      }));

      const contacts = await this.contactsRepository.createMany(contactDataArr);
      return contacts as CreateContactResponse<T>;
    }

    const { type, description } = data as ContactRequest;
    const contact = await this.contactsRepository.create({
      description,
      type,
    });

    return contact as CreateContactResponse<T>;
  }
}
