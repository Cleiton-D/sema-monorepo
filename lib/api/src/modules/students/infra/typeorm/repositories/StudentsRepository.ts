import { getRepository, Repository, FindConditions, ILike } from 'typeorm';

import IStudentsRepository from '@modules/students/repositories/IStudentsRepository';
import CreateStudentDTO from '@modules/students/dtos/CreateStudentDTO';
import StudentFilterDTO from '@modules/students/dtos/StudentFilterDTO';

import Student from '../entities/Student';

class StudentsRepository implements IStudentsRepository {
  private ormRepository: Repository<Student>;

  constructor() {
    this.ormRepository = getRepository(Student);
  }

  public async findById(student_id: string): Promise<Student | undefined> {
    const student = await this.ormRepository.findOne({
      where: {
        id: student_id,
      },
      join: {
        alias: 'student',
        leftJoinAndSelect: {
          address: 'student.address',
          contacts: 'student.student_contacts',
          contacts_contact: 'contacts.contact',
        },
      },
    });
    return student;
  }

  public async findAll({
    name,
    cpf,
    rg,
    unique_code,
  }: StudentFilterDTO): Promise<Student[]> {
    const where: FindConditions<Student>[] = [];

    if (name) {
      where.push({ name: ILike(`%${name}%`) });
    }
    if (cpf) where.push({ cpf });
    if (rg) where.push({ rg });
    if (unique_code) where.push({ unique_code });

    const students = await this.ormRepository.find({
      where,
    });

    return students;
  }

  public async create({
    name,
    mother_name,
    dad_name,
    gender,
    address,
    birth_date,
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
    contacts,
  }: CreateStudentDTO): Promise<Student> {
    const student_contacts = contacts.map(contact => ({ contact }));

    const student = await this.ormRepository.create({
      name,
      mother_name,
      dad_name,
      gender,
      address,
      birth_date,
      cpf,
      rg,
      nis,
      birth_certificate,
      breed,
      identity_document,
      nationality,
      naturalness,
      naturalness_uf,
      student_contacts,
      unique_code,
    });
    await this.ormRepository.save(student);

    return student;
  }

  public async update(student: Student): Promise<Student> {
    await this.ormRepository.save(student);
    return student;
  }
}

export default StudentsRepository;
