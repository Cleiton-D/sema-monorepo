import {
  FindConditions,
  getRepository,
  In,
  ObjectLiteral,
  Repository,
  WhereExpression,
} from 'typeorm';

import IEnrollsRepository from '@modules/enrolls/repositories/IEnrollsRepository';
import CreateEnrollDTO from '@modules/enrolls/dtos/CreateEnrollDTO';
import FindEnrollDTO from '@modules/enrolls/dtos/FindEnrollDTO';
import EnrollCountResultDTO from '@modules/enrolls/dtos/EntollCountResultDTO';
import Enroll from '../entities/Enroll';

type AndWhere = {
  condition: string;
  parameters?: ObjectLiteral;
};
class EnrollsRepository implements IEnrollsRepository {
  private ormRepository: Repository<Enroll>;

  constructor() {
    this.ormRepository = getRepository(Enroll);
  }

  private makeFindCondition({
    id,
    status,
    grade_id,
    school_id,
    school_year_id,
    person_id,
    classroom_id,
  }: FindEnrollDTO) {
    const where: FindConditions<Enroll> = {};
    const andWhere: AndWhere[] = [];

    if (id) where.id = id;
    if (status) where.status = status;
    if (grade_id) where.grade_id = grade_id;
    if (school_id) where.school_id = school_id;
    if (school_year_id) where.school_year_id = school_year_id;
    if (person_id) where.person_id = person_id;

    if (classroom_id) {
      andWhere.push({
        condition: 'classroom.id = :classroomId',
        parameters: { classroomId: classroom_id },
      });
    }

    andWhere.push({
      condition: 'enroll_classroom.status = :enrollClassroomStatus',
      parameters: { enrollClassroomStatus: 'ACTIVE' },
    });

    return {
      join: {
        alias: 'enroll',
        leftJoinAndSelect: {
          enroll_classroom: 'enroll.enroll_classrooms',
          classroom: 'enroll_classroom.classroom',
          school: 'classroom.school',
          class_period: 'classroom.class_period',
          person: 'enroll.person',
          person_contact: 'person.person_contacts',
          contact: 'person_contact.contact',
          person_address: 'person.address',
          person_document: 'person.documents',
        },
      },
      relations: ['grade'],
      where: (qb: WhereExpression) => {
        qb.where(where);

        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      },
    };
  }

  public async findOne({
    id,
    status,
    grade_id,
    school_id,
    school_year_id,
    person_id,
    classroom_id,
  }: FindEnrollDTO): Promise<Enroll | undefined> {
    const enroll = await this.ormRepository.findOne(
      this.makeFindCondition({
        id,
        status,
        grade_id,
        school_id,
        school_year_id,
        person_id,
        classroom_id,
      }),
    );

    return enroll;
  }

  public async findAllByIds(enroll_ids: string[]): Promise<Enroll[]> {
    const enrolls = await this.ormRepository.find({
      where: { id: In(enroll_ids) },
    });

    return enrolls;
  }

  public async findAll({
    id,
    status,
    grade_id,
    school_id,
    school_year_id,
    person_id,
    classroom_id,
  }: FindEnrollDTO): Promise<Enroll[]> {
    const enrolls = await this.ormRepository.find(
      this.makeFindCondition({
        id,
        status,
        grade_id,
        school_id,
        school_year_id,
        person_id,
        classroom_id,
      }),
    );

    return enrolls;
  }

  public async count({
    status,
    grade_id,
    school_id,
    school_year_id,
    person_id,
  }: FindEnrollDTO): Promise<EnrollCountResultDTO> {
    const where: FindConditions<Enroll> = {};

    if (status) where.status = status;
    if (grade_id) where.grade_id = grade_id;
    if (school_id) where.school_id = school_id;
    if (school_year_id) where.school_year_id = school_year_id;
    if (person_id) where.person_id = person_id;

    const count = await this.ormRepository.count({ where });

    return { enroll_count: count };
  }

  public async create({
    person,
    school_id,
    grade_id,
    classroom_id,
    school_year_id,
    status,
  }: CreateEnrollDTO): Promise<Enroll> {
    const enroll_classrooms = [{ classroom_id, status: 'ACTIVE' }];

    const enroll = this.ormRepository.create({
      person,
      school_id,
      grade_id,
      enroll_classrooms,
      school_year_id,
      status,
    });

    await this.ormRepository.save(enroll);
    return enroll;
  }
}

export default EnrollsRepository;
