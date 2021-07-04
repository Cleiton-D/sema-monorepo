import { inject, injectable } from 'tsyringe';

import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import CreateContactService from '@modules/contacts/services/CreateContactService';

import AppError from '@shared/errors/AppError';
import RemoveContactService from '@modules/contacts/services/RemoveContactService';
import UpdateAddressService from '@modules/address/services/UpdateAddressService';

import { DocumentType } from '../infra/typeorm/entities/PersonDocument';
import Person, { Gender } from '../infra/typeorm/entities/Person';
import IPersonsRepository from '../repositories/IPersonsRepository';
import IPersonDocumentsRepository from '../repositories/IPersonDocumentsRepository';
import IPersonContactsRepository from '../repositories/IPersonContactsRepository';

type AddressData = {
  street: string;
  house_number: string;
  city: string;
  district: string;
  region: string;
};

type DocumentData = {
  document_number: string;
  document_type: DocumentType;
};

type ContactData = {
  description: string;
  type: ContactType;
};

type UpdatePersonRequest = {
  person_id: string;
  name: string;
  mother_name: string;
  dad_name?: string;
  gender: Gender;
  birth_date: Date;
  address: AddressData;
  documents: DocumentData[];
  contacts: ContactData[];
};

@injectable()
class UpdatePersonService {
  constructor(
    @inject('PersonsRepository') private personsRepository: IPersonsRepository,
    @inject('PersonDocumentsRepository')
    private personDocumentsRepository: IPersonDocumentsRepository,
    @inject('PersonContactsRepository')
    private personContactsRepository: IPersonContactsRepository,
    private createContactService: CreateContactService,
    private removeContactService: RemoveContactService,
    private updateAddressService: UpdateAddressService,
  ) {}

  public async execute({
    person_id,
    name,
    mother_name,
    dad_name,
    gender,
    birth_date,
    address: addressData,
    documents: documentsData,
    contacts: contactsData,
  }: UpdatePersonRequest): Promise<Person> {
    const person = await this.personsRepository.findById(person_id);
    if (!person) {
      throw new AppError('Person not found!');
    }

    const existingDocuments = await this.personDocumentsRepository.findDocumentByNumberAndType(
      documentsData,
    );

    const usingByAnother = existingDocuments.some(
      document => document.person_id !== person.id,
    );
    if (usingByAnother) {
      throw new AppError(
        'Already exists an document with this number and type',
      );
    }

    const documents = documentsData.map(
      ({ document_number, document_type }) => {
        const existingDocument = person.documents.find(
          doc => doc.document_type === document_type,
        );
        if (existingDocument) {
          return { ...existingDocument, document_number };
        }

        return { document_number, document_type };
      },
    );

    const contacts = await this.createContactService.execute(contactsData);
    await this.personContactsRepository.removeMany(person.person_contacts);

    const personContacts = contacts.map(contact => ({ contact }));
    const oldContacts = person.person_contacts.map(({ contact_id }) => ({
      contact_id,
    }));

    const { street, house_number, city, district, region } = addressData;
    await this.updateAddressService.execute({
      address_id: person.address_id,
      street,
      house_number,
      city,
      district,
      region,
    });

    Object.assign(person, {
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      documents,
      person_contacts: personContacts,
    });

    const updatedPerson = await this.personsRepository.update(person);
    await this.removeContactService.execute(oldContacts);

    return updatedPerson;
  }
}

export default UpdatePersonService;
