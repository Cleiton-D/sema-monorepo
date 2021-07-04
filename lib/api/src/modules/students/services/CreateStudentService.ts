import { inject, injectable } from 'tsyringe';

import CreatePersonService from '@modules/persons/services/CreatePersonService';
import UpdatePersonService from '@modules/persons/services/UpdatePersonService';

import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import Person, { Gender } from '@modules/persons/infra/typeorm/entities/Person';
import { DocumentType } from '@modules/persons/infra/typeorm/entities/PersonDocument';
import Student from '../infra/typeorm/entities/Student';
import IStudentsRepository from '../repositories/IStudentsRepository';

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

type CreateStudentRequest = {
  person_id?: string;
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
class CreateStudentService {
  constructor(
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository,
    private createPerson: CreatePersonService,
    private updatePerson: UpdatePersonService,
  ) {}

  public async execute({
    person_id,
    name,
    mother_name,
    dad_name,
    birth_date,
    gender,
    documents,
    address,
    contacts,
  }: CreateStudentRequest): Promise<Student> {
    const person = await this.getPerson({
      person_id,
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      documents,
      address,
      contacts,
    });

    const student = await this.studentsRepository.create({ person });
    return student;
  }

  private async getPerson({
    person_id,
    name,
    mother_name,
    dad_name,
    birth_date,
    gender,
    documents,
    address,
    contacts,
  }: CreateStudentRequest): Promise<Person> {
    if (person_id) {
      const person = await this.updatePerson.execute({
        person_id,
        name,
        mother_name,
        dad_name,
        birth_date,
        gender,
        documents,
        address,
        contacts,
      });

      return person;
    }

    const person = await this.createPerson.execute({
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      documents,
      address,
      contacts,
    });

    return person;
  }
}

export default CreateStudentService;
