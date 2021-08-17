import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import CreateContactService from '@modules/contacts/services/CreateContactService';
import CreateAddressService from '@modules/address/services/CreateAddressService';
import IPersonDocumentsRepository from '../repositories/IPersonDocumentsRepository';
import IPersonsRepository from '../repositories/IPersonsRepository';

import Person, { Gender } from '../infra/typeorm/entities/Person';
import { DocumentType } from '../infra/typeorm/entities/PersonDocument';

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

type CreatePersonRequest = {
  name: string;
  mother_name?: string;
  dad_name?: string;
  gender?: Gender;
  birth_date?: Date;
  address?: AddressData;
  documents?: DocumentData[];
  contacts: ContactData[];
};

@injectable()
class CreatePersonService {
  constructor(
    @inject('PersonsRepository') private personsRepository: IPersonsRepository,
    @inject('PersonDocumentsRepository')
    private personDocumentsRepository: IPersonDocumentsRepository,
    private createContactService: CreateContactService,
    private createAddressService: CreateAddressService,
  ) {}

  public async execute({
    name,
    mother_name,
    dad_name,
    birth_date,
    address: addressData,
    documents: documentsData,
    contacts: contactsData,
    gender,
  }: CreatePersonRequest): Promise<Person> {
    const documents = await this.getDocuments({ documents: documentsData });

    const contacts = await Promise.all(
      contactsData.map(({ type, description }) =>
        this.createContactService.execute({ type, description }),
      ),
    );

    const address = addressData
      ? await this.createAddressService.execute({
          city: addressData.city,
          district: addressData.district,
          house_number: addressData.house_number,
          region: addressData.region,
          street: addressData.street,
        })
      : undefined;

    const person = await this.personsRepository.create({
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      address,
      documents,
      contacts,
    });

    return person;
  }

  private async getDocuments({
    documents: documentsData,
  }: Pick<CreatePersonRequest, 'documents'>) {
    if (!documentsData) return [];

    const existingDocuments = await this.personDocumentsRepository.findDocumentByNumberAndType(
      documentsData,
    );

    if (existingDocuments.length) {
      throw new AppError(
        'Already exists an document with this number and type',
      );
    }

    const documents = documentsData.map(
      ({ document_number, document_type }) => ({
        document_number,
        document_type,
      }),
    );

    return documents;
  }
}

export default CreatePersonService;
