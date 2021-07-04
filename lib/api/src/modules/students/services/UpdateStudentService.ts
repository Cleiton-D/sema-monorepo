import { inject, injectable } from 'tsyringe';

import UpdatePersonService from '@modules/persons/services/UpdatePersonService';
import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import { Gender } from '@modules/persons/infra/typeorm/entities/Person';
import { DocumentType } from '@modules/persons/infra/typeorm/entities/PersonDocument';

import AppError from '@shared/errors/AppError';

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

type UpdateStudentRequest = {
  student_id: string;
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
class UpdateStudentService {
  constructor(
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository,
    private updatePerson: UpdatePersonService,
  ) {}

  public async execute({
    student_id,
    name,
    mother_name,
    dad_name,
    birth_date,
    gender,
    documents,
    address,
    contacts,
  }: UpdateStudentRequest): Promise<Student> {
    const student = await this.studentsRepository.findById(student_id);
    if (!student) {
      throw new AppError('Student not found');
    }

    const person = await this.updatePerson.execute({
      person_id: student.person.id,
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      documents,
      address,
      contacts,
    });

    Object.assign(student, { person, person_id: person.id });
    await this.studentsRepository.update(student);

    return student;
  }
}

export default UpdateStudentService;
