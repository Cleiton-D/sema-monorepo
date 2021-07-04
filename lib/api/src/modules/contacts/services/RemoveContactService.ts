import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IContactsRepository from '../repositories/IContactsRepository';

type RemoveContactRequest = {
  contact_id: string;
};

type RemoveContactsRequest = RemoveContactRequest | RemoveContactRequest[];

@injectable()
class RemoveContactService {
  contactsRepository: IContactsRepository;

  constructor(
    @inject('ContactsRepository') contactsRepository: IContactsRepository,
  ) {
    this.contactsRepository = contactsRepository;
  }

  public async execute(data: RemoveContactsRequest): Promise<void> {
    if (Array.isArray(data)) {
      const contactsIds = data.map(({ contact_id }) => contact_id);
      const contacts = await this.contactsRepository.findMany(contactsIds);

      await this.contactsRepository.removeMany(contacts);
      return;
    }

    const { contact_id } = data;
    const contact = await this.contactsRepository.findById(contact_id);
    if (!contact) {
      throw new AppError('Contact not found');
    }

    await this.contactsRepository.remove(contact);
  }
}

export default RemoveContactService;
