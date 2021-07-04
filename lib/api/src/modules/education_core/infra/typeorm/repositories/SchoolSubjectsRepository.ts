import { getRepository, Repository } from 'typeorm';

import ISchoolSubjectsRepository from '@modules/education_core/repositories/ISchoolSubjectsRepository';
import CreateSchoolSubjectDTO from '@modules/education_core/dtos/CreateSchoolSubjectDTO';

import CountResultDTO from '@modules/classes/dtos/CountResultDTO';
import SchoolSubject from '../entities/SchoolSubject';

class SchoolSubjectsRepository implements ISchoolSubjectsRepository {
  private ormRepository: Repository<SchoolSubject>;

  constructor() {
    this.ormRepository = getRepository(SchoolSubject);
  }

  public async findByid(
    school_subject_id: string,
  ): Promise<SchoolSubject | undefined> {
    const schoolSubject = await this.ormRepository.findOne(school_subject_id);
    return schoolSubject;
  }

  public async findAll(): Promise<SchoolSubject[]> {
    const schoolSubject = await this.ormRepository.find({
      order: { created_at: 'DESC' },
    });
    return schoolSubject;
  }

  public async count(): Promise<CountResultDTO> {
    const count = await this.ormRepository.count();
    return { count };
  }

  public async create({
    description,
    additional_description,
  }: CreateSchoolSubjectDTO): Promise<SchoolSubject> {
    const schoolSubject = this.ormRepository.create({
      description,
      additional_description,
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
