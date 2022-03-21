import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Student from '../infra/typeorm/entities/Student';
import IStudentsRepository from '../repositories/IStudentsRepository';

type ShowStudentRequest = {
  studentId: string;
};

@injectable()
class ShowStudentService {
  constructor(
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository,
  ) {}

  public async execute({ studentId }: ShowStudentRequest): Promise<Student> {
    const student = await this.studentsRepository.findById(studentId);
    if (!student) {
      throw new AppError('Student not found', 404);
    }

    return student;
  }
}

export default ShowStudentService;
