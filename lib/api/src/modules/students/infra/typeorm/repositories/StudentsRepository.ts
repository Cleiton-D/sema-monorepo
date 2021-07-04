import { getRepository, Repository } from 'typeorm';

import IStudentsRepository from '@modules/students/repositories/IStudentsRepository';
import CreateStudentDTO from '@modules/students/dtos/CreateStudentDTO';

import Student from '../entities/Student';

class StudentsRepository implements IStudentsRepository {
  private ormRepository: Repository<Student>;

  constructor() {
    this.ormRepository = getRepository(Student);
  }

  public async findById(student_id: string): Promise<Student | undefined> {
    const student = await this.ormRepository.findOne(student_id);
    return student;
  }

  public async create({ person }: CreateStudentDTO): Promise<Student> {
    const student = await this.ormRepository.create({ person });
    await this.ormRepository.save(student);

    return student;
  }

  public async update(student: Student): Promise<Student> {
    await this.ormRepository.save(student);
    return student;
  }
}

export default StudentsRepository;
