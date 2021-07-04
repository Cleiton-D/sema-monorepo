import { getRepository, Repository } from 'typeorm';

import ITeachersRepository from '@modules/teachers/repositories/ITeachersRepository';
import CreateTeacherDTO from '@modules/teachers/dtos/CreateTeacherDTO';
import Teacher from '../entities/Teacher';

class TeachersRepository implements ITeachersRepository {
  private ormRepository: Repository<Teacher>;

  constructor() {
    this.ormRepository = getRepository(Teacher);
  }

  public async findById(teacher_id: string): Promise<Teacher | undefined> {
    const teacher = await this.ormRepository.findOne(teacher_id);
    return teacher;
  }

  public async findByEmployee(
    employee_id: string,
  ): Promise<Teacher | undefined> {
    const teacher = await this.ormRepository.findOne({ employee_id });
    return teacher;
  }

  public async create({ employee }: CreateTeacherDTO): Promise<Teacher> {
    const teacher = this.ormRepository.create({ employee });
    await this.ormRepository.save(teacher);

    return teacher;
  }
}

export default TeachersRepository;
