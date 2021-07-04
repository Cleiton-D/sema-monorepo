import { FindConditions, getRepository, Repository } from 'typeorm';

import IClassesRepository from '@modules/classes/repositories/IClassesRepository';
import CreateClassDTO from '@modules/classes/dtos/CreateClassDTO';
import FindClassDTO from '@modules/classes/dtos/FindClassDTO';
import CountResultDTO from '@modules/classes/dtos/CountResultDTO';
import Class from '../entities/Class';

class ClassesRepository implements IClassesRepository {
  private ormRepository: Repository<Class>;

  constructor() {
    this.ormRepository = getRepository(Class);
  }

  public async findById(class_id: string): Promise<Class | undefined> {
    const classEntity = await this.ormRepository.findOne({
      where: {
        id: class_id,
      },
      relations: ['classroom', 'school_subject', 'employee', 'employee.person'],
    });
    return classEntity;
  }

  public async findAll({
    classroom_id,
    employee_id,
    school_subject_id,
  }: FindClassDTO): Promise<Class[]> {
    const where: FindConditions<Class> = {};
    if (classroom_id) where.classroom_id = classroom_id;
    if (employee_id) where.employee_id = employee_id;
    if (school_subject_id) where.school_subject_id = school_subject_id;

    const classes = await this.ormRepository.find({
      where,
      relations: ['classroom', 'school_subject', 'employee', 'employee.person'],
    });
    return classes;
  }

  public async count({
    classroom_id,
    employee_id,
    school_subject_id,
  }: FindClassDTO): Promise<CountResultDTO> {
    const where: FindConditions<Class> = {};
    if (classroom_id) where.classroom_id = classroom_id;
    if (employee_id) where.employee_id = employee_id;
    if (school_subject_id) where.school_subject_id = school_subject_id;

    const count = await this.ormRepository.count({
      where,
    });
    return { count };
  }

  public async create({
    employee_id,
    school_subject_id,
    classroom_id,
    class_date,
    time_start,
    taught_content,
  }: CreateClassDTO): Promise<Class> {
    const classEntity = this.ormRepository.create({
      employee_id,
      school_subject_id,
      classroom_id,
      class_date,
      time_start,
      taught_content,
      status: 'PROGRESS',
    });

    await this.ormRepository.save(classEntity);
    return classEntity;
  }

  public async update(classEntity: Class): Promise<Class> {
    await this.ormRepository.save(classEntity);
    return classEntity;
  }
}

export default ClassesRepository;
