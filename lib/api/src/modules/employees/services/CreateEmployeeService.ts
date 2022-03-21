import { inject, injectable } from 'tsyringe';

import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import { Gender } from '@modules/persons/infra/typeorm/entities/Person';
import CreateUserService from '@modules/users/services/CreateUserService';
import CreateAddressService from '@modules/address/services/CreateAddressService';

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

type ContactData = {
  description: string;
  type: ContactType;
};

type CreateEmployeeRequest = {
  name: string;
  mother_name?: string;
  dad_name?: string;
  gender?: Gender;
  birth_date?: Date;
  address?: AddressData;
  contacts: ContactData[];
  pis_pasep: string;
  cpf: string;
  rg?: string;
  education_level: string;
};

@injectable()
class CreateEmployeeService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    private createAddressService: CreateAddressService,
    private createUser: CreateUserService,
  ) {}

  public async execute({
    name,
    mother_name,
    dad_name,
    birth_date,
    gender,
    address: addressData,
    contacts,
    education_level,
    pis_pasep,
    cpf,
    rg,
  }: CreateEmployeeRequest): Promise<Employee> {
    const existsEmployee = await this.employeesRepository.findOne({
      pis_pasep,
    });

    if (existsEmployee) {
      throw new AppError('Already exists an employee with this PIS/PASEP');
    }

    // const email = contacts.find(contact => contact.type === 'email');
    // if (!email || !email.description) {
    //   throw new AppError('Email cannot be empty');
    // }
    if (!cpf) {
      throw new AppError('CPF cannot be empty');
    }

    const parsedCpf = cpf.replace(/\D/g, '');

    const user = await this.createUser.execute({
      username: name,
      login: parsedCpf,
      password: '12345678',
    });

    const address = addressData
      ? await this.createAddressService.execute({
          city: addressData.city,
          district: addressData.district,
          house_number: addressData.house_number,
          region: addressData.region,
          street: addressData.street,
        })
      : undefined;

    const employee = await this.employeesRepository.create({
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      contacts,
      address,
      user,
      education_level,
      pis_pasep,
      cpf,
      rg,
    });

    return employee;
  }
}

export default CreateEmployeeService;
