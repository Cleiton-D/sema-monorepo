import { inject, injectable } from 'tsyringe';

import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import { Gender } from '@modules/persons/infra/typeorm/entities/Person';
import { DocumentType } from '@modules/persons/infra/typeorm/entities/PersonDocument';

import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';
import Employee from '@modules/employees/infra/typeorm/entities/Employee';
import CreateEmployeeService from '@modules/employees/services/CreateEmployeeService';
import UpdateEmployeeService from '@modules/employees/services/UpdateEmployeeService';
import Teacher from '../infra/typeorm/entities/Teacher';
import ITeachersRepository from '../repositories/ITeachersRepository';

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

type CreateTeacherRequest = {
  person_id?: string;
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
class CreateTeacherService {
  constructor(
    @inject('TeachersRepository')
    private teachersRepository: ITeachersRepository,
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    private createEmployee: CreateEmployeeService,
    private updateEmployee: UpdateEmployeeService,
  ) {}

  public async execute({
    person_id,
    name,
    mother_name,
    dad_name,
    gender,
    birth_date,
    address,
    documents,
    contacts,
    pis_pasep,
    education_level,
  }: CreateTeacherRequest): Promise<Teacher> {
    const employee = await this.getEmployee({
      person_id,
      name,
      mother_name,
      dad_name,
      gender,
      birth_date,
      address,
      documents,
      contacts,
      pis_pasep,
      education_level,
    });

    const teacher = await this.teachersRepository.create({ employee });
    return teacher;
  }

  private async getEmployee({
    person_id,
    name,
    mother_name,
    dad_name,
    gender,
    birth_date,
    address,
    documents,
    contacts,
    pis_pasep,
    education_level,
  }: CreateTeacherRequest): Promise<Employee> {
    const existentEmployee = person_id
      ? await this.employeesRepository.findOne({ person_id })
      : undefined;

    if (person_id && existentEmployee) {
      const employee = await this.updateEmployee.execute({
        employee_id: existentEmployee.id,
        name,
        mother_name,
        dad_name,
        gender,
        birth_date,
        address,
        documents,
        contacts,
        pis_pasep,
        education_level,
      });

      return employee;
    }

    const employee = await this.createEmployee.execute({
      name,
      mother_name,
      dad_name,
      gender,
      birth_date,
      address,
      documents,
      contacts,
      pis_pasep,
      education_level,
    });

    return employee;
  }
}

export default CreateTeacherService;
