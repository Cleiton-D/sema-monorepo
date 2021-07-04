import { inject, injectable } from 'tsyringe';

import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import { Gender } from '@modules/persons/infra/typeorm/entities/Person';
import { DocumentType } from '@modules/persons/infra/typeorm/entities/PersonDocument';
import CreatePersonService from '@modules/persons/services/CreatePersonService';
import CreateUserService from '@modules/users/services/CreateUserService';

import AppError from '@shared/errors/AppError';

import Employee from '../infra/typeorm/entities/Employee';
import IEmployeesRepository from '../repositories/IEmployeesRepository';

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

type CreateEmployeeRequest = {
  name: string;
  mother_name: string;
  dad_name?: string;
  gender: Gender;
  birth_date: Date;
  address: AddressData;
  documents: DocumentData[];
  contacts: ContactData[];
  pis_pasep: string;
  education_level: string;
};

@injectable()
class CreateEmployeeService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    private createPerson: CreatePersonService,
    private createUser: CreateUserService,
  ) {}

  public async execute({
    name,
    mother_name,
    dad_name,
    birth_date,
    gender,
    documents,
    address,
    contacts,
    education_level,
    pis_pasep,
  }: CreateEmployeeRequest): Promise<Employee> {
    const existsEmployee = await this.employeesRepository.findOne({
      pis_pasep,
    });

    if (existsEmployee) {
      throw new AppError('Already exists an employee with this PIS/PASEP');
    }

    const email = contacts.find(contact => contact.type === 'email');
    if (!email || !email.description) {
      throw new AppError('Email cannot be empty');
    }

    const newDocuments: DocumentData[] = [
      ...documents,
      { document_type: 'PIS-PASEP', document_number: pis_pasep },
    ];

    const cpf = newDocuments.find(document => document.document_type === 'CPF');
    if (!cpf || !cpf.document_number) {
      throw new AppError('CPF cannot be empty');
    }

    const person = await this.createPerson.execute({
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      documents: newDocuments,
      address,
      contacts,
    });

    const user = await this.createUser.execute({
      username: name,
      login: email.description,
      password: cpf.document_number,
    });

    const employee = await this.employeesRepository.create({
      person,
      user,
      education_level,
      pis_pasep,
    });

    return employee;
  }
}

export default CreateEmployeeService;
