import { inject, injectable } from 'tsyringe';

import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import UpdateAddressService from '@modules/address/services/UpdateAddressService';
import CreateContactService from '@modules/contacts/services/CreateContactService';
import RemoveContactService from '@modules/contacts/services/RemoveContactService';

import AppError from '@shared/errors/AppError';
import { Gender } from '@shared/infra/typeorm/enums/Gender';

import Employee from '../infra/typeorm/entities/Employee';
import IEmployeesRepository from '../repositories/IEmployeesRepository';
import IEmployeeContactsRepository from '../repositories/IEmployeeContactsRepository';

type AddressData = {
  street: string;
  house_number: string;
  city: string;
  district: string;
  region: string;
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
  contacts: ContactData[];
  pis_pasep: string;
  cpf: string;
  rg?: string;
  education_level: string;
};

@injectable()
class UpdateEmployeeService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    @inject('EmployeeContactsRepository')
    private employeeContactsRepository: IEmployeeContactsRepository,
    private createContactService: CreateContactService,
    private removeContactService: RemoveContactService,
    private updateAddressService: UpdateAddressService,
  ) {}

  public async execute({
    employee_id,
    name,
    mother_name,
    dad_name,
    birth_date,
    gender,
    address: addressData,
    contacts: contactsData,
    education_level,
    pis_pasep,
    cpf,
    rg,
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

    // const email = contactsData.find(contact => contact.type === 'email');
    // if (!email || !email.description) {
    //   throw new AppError('Email cannot be empty');
    // }

    if (!cpf) {
      throw new AppError('CPF cannot be empty');
    }

    const contacts = await this.createContactService.execute(contactsData);
    await this.employeeContactsRepository.removeMany(
      employee.employee_contacts,
    );

    const employeeContacts = contacts.map(contact => ({ contact }));
    const oldContacts = employee.employee_contacts.map(({ contact_id }) => ({
      contact_id,
    }));

    const { street, house_number, city, district, region } = addressData;
    await this.updateAddressService.execute({
      address_id: employee.address_id,
      street,
      house_number,
      city,
      district,
      region,
    });

    Object.assign(employee, {
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      education_level,
      pis_pasep,
      cpf,
      rg,
      employee_contacts: employeeContacts,
    });

    const updatedEmployee = await this.employeesRepository.update(employee);
    await this.removeContactService.execute(oldContacts);

    return updatedEmployee;
  }
}

export default UpdateEmployeeService;
