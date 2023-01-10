import { FindOptionsWhere, Repository } from 'typeorm';

import { dataSource } from '@config/data_source';

import ISchoolTeachersRepository from '@modules/schools/repositories/ISchoolTeachersRepository';
import CreateSchoolTeacherDTO from '@modules/schools/dtos/CreateSchoolTeacherDTO';
import FindSchoolTeacherDTO from '@modules/schools/dtos/FindSchoolTeacherDTO';

import CountResultDTO from '@modules/schools/dtos/CountResultDTO';
import SchoolTeacher from '../entities/SchoolTeacher';

class SchoolTeachersRepository implements ISchoolTeachersRepository {
  private ormRepository: Repository<SchoolTeacher>;

  constructor() {
    this.ormRepository = dataSource.getRepository(SchoolTeacher);
  }

  public async findOne({
    id,
    school_id,
  }: FindSchoolTeacherDTO): Promise<SchoolTeacher | undefined> {
    const where: FindOptionsWhere<SchoolTeacher> = {};

    if (id) where.id = id;
    if (school_id) where.school_id = school_id;

    const schoolTeacher = await this.ormRepository.findOne({
      where,
      relations: ['employee', 'school'],
    });

    return schoolTeacher ?? undefined;
  }

  public async findAll({
    id,
    school_id,
    school_year_id,
  }: FindSchoolTeacherDTO): Promise<SchoolTeacher[]> {
    const where: FindOptionsWhere<SchoolTeacher> = {};

    if (id) where.id = id;
    if (school_id) where.school_id = school_id;
    if (school_year_id) where.school_year_id = school_year_id;

    const schoolTeachers = await this.ormRepository.find({
      where,
      order: {
        employee: {
          name: 'ASC',
        },
      },
      relations: {
        employee: true,
      },
    });

    return schoolTeachers;
  }

  public async count({
    id,
    school_id,
    school_year_id,
  }: FindSchoolTeacherDTO): Promise<CountResultDTO> {
    const where: FindOptionsWhere<SchoolTeacher> = {};

    if (id) where.id = id;
    if (school_id) where.school_id = school_id;
    if (school_year_id) where.school_year_id = school_year_id;

    const count = await this.ormRepository.count({
      where,
    });

    return { count };
  }

  public async create({
    employee_id,
    school_id,
    school_year_id,
  }: CreateSchoolTeacherDTO): Promise<SchoolTeacher> {
    const schoolTeacher = this.ormRepository.create({
      employee_id,
      school_id,
      school_year_id,
    });
    await this.ormRepository.save(schoolTeacher);

    return schoolTeacher;
  }

  public async delete(schoolTeacher: SchoolTeacher): Promise<void> {
    await this.ormRepository.remove(schoolTeacher);
  }
}

export default SchoolTeachersRepository;
