import { FindConditions, getRepository, Repository } from 'typeorm';

import CreateSchoolDTO from '@modules/schools/dtos/CreateSchoolDTO';
import ISchoolsRepository from '@modules/schools/repositories/ISchoolsRepository';

import FindSchoolsDTO from '@modules/schools/dtos/FindSchoolsDTO';
import CountResultDTO from '@modules/schools/dtos/CountResultDTO';
import School from '../entities/School';

export default class SchoolsRepository implements ISchoolsRepository {
  private ormRepository: Repository<School>;

  constructor() {
    this.ormRepository = getRepository(School);
  }

  public async findOne({
    id,
    branch_id,
    inep_code,
  }: FindSchoolsDTO): Promise<School | undefined> {
    const where: FindConditions<School> = {};

    if (id) where.id = id;
    if (branch_id) where.branch_id = branch_id;
    if (inep_code) where.inep_code = inep_code;

    const school = await this.ormRepository.findOne({
      where,
      join: {
        alias: 'school',
        leftJoinAndSelect: {
          school_contacts: 'school.school_contacts',
          contacts: 'school_contacts.contact',
        },
      },
      relations: ['address', 'director', 'vice_director'],
    });

    return school;
  }

  public async findAll(): Promise<School[]> {
    const schools = await this.ormRepository.find();
    return schools;
  }

  public async findWithEnrolls(): Promise<School[]> {
    const queryBuilder = this.ormRepository.createQueryBuilder('school');
    queryBuilder.leftJoinAndSelect('school.director', 'director');
    queryBuilder.leftJoinAndSelect('school.vice_director', 'vice_director');
    queryBuilder.loadRelationCountAndMap(
      'school.enroll_count',
      'school.enrolls',
      'enroll',
      qb =>
        qb
          .where({ status: 'ACTIVE' })
          .innerJoin(
            'school_years',
            'school_year',
            "school_year.status != 'INACTIVE'",
          ),
    );

    return queryBuilder.getMany();
  }

  public async count(): Promise<CountResultDTO> {
    const count = await this.ormRepository.count();
    return { count };
  }

  public async create({
    name,
    inep_code,
    director_id,
    vice_director_id,
    creation_decree,
    recognition_opinion,
    authorization_ordinance,
    branch,
    address,
    contacts,
  }: CreateSchoolDTO): Promise<School> {
    const school_contacts = contacts.map(contact => ({ contact }));

    const school = this.ormRepository.create({
      name,
      inep_code,
      branch,
      director_id,
      vice_director_id,
      creation_decree,
      recognition_opinion,
      authorization_ordinance,
      address,
      school_contacts,
    });

    await this.ormRepository.save(school);
    return school;
  }

  public async update(school: School): Promise<School> {
    await this.ormRepository.save(school);
    return school;
  }
}
