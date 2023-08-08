import { FindOptionsWhere, In, Repository } from 'typeorm';

import { dataSource } from '@config/data_source';

import ISchoolSubjectsRepository from '@modules/education_core/repositories/ISchoolSubjectsRepository';
import CreateSchoolSubjectDTO from '@modules/education_core/dtos/CreateSchoolSubjectDTO';

import CountResultDTO from '@modules/classes/dtos/CountResultDTO';
import FindSchoolSubjectDTO from '@modules/education_core/dtos/FindSchoolSubjectDTO';
import SchoolSubject from '../entities/SchoolSubject';

class SchoolSubjectsRepository implements ISchoolSubjectsRepository {
  private ormRepository: Repository<SchoolSubject>;

  constructor() {
    this.ormRepository = dataSource.getRepository(SchoolSubject);
  }

  public async findByid(
    school_subject_id: string,
  ): Promise<SchoolSubject | undefined> {
    const schoolSubject = await this.ormRepository.findOne({
      where: { id: school_subject_id },
    });
    return schoolSubject ?? undefined;
  }

  public async findOne(
    filters: FindSchoolSubjectDTO = {},
  ): Promise<SchoolSubject | undefined> {
    const { id, include_multidisciplinary, is_multidisciplinary } = filters;

    const where: FindOptionsWhere<SchoolSubject> = {};
    if (id) {
      if (Array.isArray(id)) {
        where.id = In(id);
      } else {
        where.id = id;
      }
    }

    if (
      !include_multidisciplinary &&
      typeof is_multidisciplinary !== 'undefined'
    ) {
      where.is_multidisciplinary = !!is_multidisciplinary;
    }

    const schoolSubject = await this.ormRepository.findOne({
      where,
      order: { index: 'ASC' },
    });
    return schoolSubject || undefined;
  }

  public async findAll(
    filters: FindSchoolSubjectDTO = {},
  ): Promise<SchoolSubject[]> {
    const {
      id,
      is_multidisciplinary,
      include_multidisciplinary,
      school_year_id,
    } = filters;

    const where: FindOptionsWhere<SchoolSubject> = {};
    if (id) {
      if (Array.isArray(id)) {
        where.id = In(id);
      } else {
        where.id = id;
      }
    }
    if (school_year_id) where.school_year_id = school_year_id;

    if (
      !include_multidisciplinary &&
      typeof is_multidisciplinary !== 'undefined'
    ) {
      where.is_multidisciplinary = !!is_multidisciplinary;
    }

    const schoolSubject = await this.ormRepository.find({
      where,
      order: { index: 'ASC' },
    });
    return schoolSubject;
  }

  public async count(
    filters: FindSchoolSubjectDTO = {},
  ): Promise<CountResultDTO> {
    const where: FindOptionsWhere<SchoolSubject> = {};

    if (filters.school_year_id) where.school_year_id = filters.school_year_id;

    const count = await this.ormRepository.count({
      where,
    });
    return { count };
  }

  public async create({
    description,
    additional_description,
    index,
    is_multidisciplinary,
    school_year_id,
  }: CreateSchoolSubjectDTO): Promise<SchoolSubject> {
    const schoolSubject = this.ormRepository.create({
      description,
      additional_description,
      index,
      is_multidisciplinary,
      school_year_id,
    });
    await this.ormRepository.save(schoolSubject);

    return schoolSubject;
  }

  public async update(schoolSubject: SchoolSubject): Promise<SchoolSubject> {
    await this.ormRepository.save(schoolSubject);
    return schoolSubject;
  }

  public async delete(schoolSubject: SchoolSubject): Promise<void> {
    await this.ormRepository.remove(schoolSubject);
  }
}

export default SchoolSubjectsRepository;
