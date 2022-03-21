import { inject, injectable } from 'tsyringe';

import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import CreateAddressService from '@modules/address/services/CreateAddressService';

import { Gender } from '@shared/infra/typeorm/enums/Gender';

import Student from '../infra/typeorm/entities/Student';
import IStudentsRepository from '../repositories/IStudentsRepository';

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

type CreateStudentRequest = {
  name: string;
  mother_name: string;
  dad_name?: string;
  gender: Gender;
  birth_date: string;
  address: AddressData;
  contacts: ContactData[];
  cpf?: string;
  rg?: string;
  nis?: string;
  birth_certificate?: string;
  breed: string;
  naturalness: string;
  naturalness_uf: string;
  identity_document: string;
  nationality: string;
  unique_code: string;
};

@injectable()
class CreateStudentService {
  constructor(
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository,
    private createAddressService: CreateAddressService,
  ) {}

  public async execute({
    name,
    mother_name,
    dad_name,
    birth_date,
    gender,
    address: addressData,
    contacts,
    cpf,
    rg,
    nis,
    birth_certificate,
    breed,
    identity_document,
    nationality,
    naturalness,
    naturalness_uf,
    unique_code,
  }: CreateStudentRequest): Promise<Student> {
    const address = addressData
      ? await this.createAddressService.execute({
          city: addressData.city,
          district: addressData.district,
          house_number: addressData.house_number,
          region: addressData.region,
          street: addressData.street,
        })
      : undefined;

    const student = await this.studentsRepository.create({
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      address,
      cpf,
      rg,
      nis,
      birth_certificate,
      breed,
      identity_document,
      nationality,
      naturalness,
      naturalness_uf,
      unique_code,
      contacts: contacts || [],
    });

    return student;
  }
}

export default CreateStudentService;
