import { inject, injectable } from 'tsyringe';

import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import { Gender } from '@modules/persons/infra/typeorm/entities/Person';
import CreateContactService from '@modules/contacts/services/CreateContactService';
import RemoveContactService from '@modules/contacts/services/RemoveContactService';
import UpdateAddressService from '@modules/address/services/UpdateAddressService';

import AppError from '@shared/errors/AppError';

import Student from '../infra/typeorm/entities/Student';
import IStudentsRepository from '../repositories/IStudentsRepository';
import IStudentContactsRepository from '../repositories/IStudentContactsRepository';

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

type UpdateStudentRequest = {
  id: string;
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
class UpdateStudentService {
  constructor(
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository,
    @inject('StudentContactsRepository')
    private studentContactsRepository: IStudentContactsRepository,
    private createContactService: CreateContactService,
    private removeContactService: RemoveContactService,
    private updateAddressService: UpdateAddressService,
  ) {}

  public async execute({
    id,
    name,
    mother_name,
    dad_name,
    birth_date,
    gender,
    address: addressData,
    contacts: contactsData,
    cpf,
    rg,
    nis,
    birth_certificate,
    breed,
    identity_document,
    unique_code,
    nationality,
    naturalness,
    naturalness_uf,
  }: UpdateStudentRequest): Promise<Student> {
    const student = await this.studentsRepository.findById(id);
    if (!student) {
      throw new AppError('Student not found');
    }

    const contacts = await this.createContactService.execute(contactsData);
    await this.studentContactsRepository.removeMany(student.student_contacts);

    const studentContacts = contacts.map(contact => ({ contact }));
    const oldContacts = student.student_contacts.map(({ contact_id }) => ({
      contact_id,
    }));

    const { street, house_number, city, district, region } = addressData;
    await this.updateAddressService.execute({
      address_id: student.address_id,
      street,
      house_number,
      city,
      district,
      region,
    });

    Object.assign(student, {
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      cpf,
      rg,
      nis,
      student_contacts: studentContacts,
      birth_certificate,
      breed,
      identity_document,
      unique_code,
      nationality,
      naturalness,
      naturalness_uf,
    });

    const updatedStudent = await this.studentsRepository.update(student);
    await this.removeContactService.execute(oldContacts);

    return updatedStudent;
  }
}

export default UpdateStudentService;
