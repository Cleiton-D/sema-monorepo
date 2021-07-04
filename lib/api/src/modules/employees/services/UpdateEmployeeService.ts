import { inject, injectable } from 'tsyringe';

import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import { Gender } from '@modules/persons/infra/typeorm/entities/Person';
import { DocumentType } from '@modules/persons/infra/typeorm/entities/PersonDocument';

import AppError from '@shared/errors/AppError';

import UpdatePersonService from '@modules/persons/services/UpdatePersonService';
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

type UpdateEmployeeRequest = {
  employee_id: string;
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
class UpdateEmployeeService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    private updatePerson: UpdatePersonService,
  ) {}

  public async execute({
    employee_id,
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
  }: UpdateEmployeeRequest): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({
      id: employee_id,
    });
    if (!employee) {
      throw new AppError('Employee not found');
    }

    const existsEmployee = await this.employeesRepository.findOne({
      pis_pasep,
    });
    if (existsEmployee && existsEmployee.id !== employee_id) {
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

    const person = await this.updatePerson.execute({
      person_id: employee.person_id,
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      documents: newDocuments,
      address,
      contacts,
    });

    Object.assign(employee, {
      person,
      person_id: person.id,
      education_level,
      pis_pasep,
    });

    return this.employeesRepository.update(employee);
  }
}

export default UpdateEmployeeService;
