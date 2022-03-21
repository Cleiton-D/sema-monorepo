import { FindConditions, getRepository, Repository } from 'typeorm';

import ISchoolTeachersRepository from '@modules/schools/repositories/ISchoolTeachersRepository';
import CreateSchoolTeacherDTO from '@modules/schools/dtos/CreateSchoolTeacherDTO';
import FindSchoolTeacherDTO from '@modules/schools/dtos/FindSchoolTeacherDTO';

import CountResultDTO from '@modules/schools/dtos/CountResultDTO';
import SchoolTeacher from '../entities/SchoolTeacher';

class SchoolTeachersRepository implements ISchoolTeachersRepository {
  private ormRepository: Repository<SchoolTeacher>;

  constructor() {
    this.ormRepository = getRepository(SchoolTeacher);
  }

  public async findOne({
    id,
    school_id,
  }: FindSchoolTeacherDTO): Promise<SchoolTeacher | undefined> {
    const where: FindConditions<SchoolTeacher> = {};

    if (id) where.id = id;
    if (school_id) where.school_id = school_id;

    const schoolTeachers = await this.ormRepository.findOne({
      where,
      relations: ['employee', 'school'],
    });

    return schoolTeachers;
  }

  public async findAll({
    id,
    school_id,
  }: FindSchoolTeacherDTO): Promise<SchoolTeacher[]> {
    const where: FindConditions<SchoolTeacher> = {};

    if (id) where.id = id;
    if (school_id) where.school_id = school_id;

    const schoolTeachers = await this.ormRepository.find({
      where,
      relations: ['employee'],
    });

    return schoolTeachers;
  }

  public async count({
    id,
    school_id,
  }: FindSchoolTeacherDTO): Promise<CountResultDTO> {
    const where: FindConditions<SchoolTeacher> = {};

    if (id) where.id = id;
    if (school_id) where.school_id = school_id;

    const count = await this.ormRepository.count({
      where,
    });

    return { count };
  }

  public async create({
    employee_id,
    school_id,
  }: CreateSchoolTeacherDTO): Promise<SchoolTeacher> {
    const schoolTeacher = this.ormRepository.create({ employee_id, school_id });
    await this.ormRepository.save(schoolTeacher);

    return schoolTeacher;
  }

  public async delete(schoolTeacher: SchoolTeacher): Promise<void> {
    await this.ormRepository.remove(schoolTeacher);
  }
}

export default SchoolTeachersRepository;
