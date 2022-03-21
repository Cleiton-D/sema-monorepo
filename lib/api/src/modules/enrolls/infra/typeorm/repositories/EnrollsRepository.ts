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
    student_id,
    classroom_id,
    class_period_id,
    student_name,
    student_cpf,
    student_nis,
    student_birth_certificate,
    order,
  }: FindEnrollDTO) {
    const where: FindConditions<Enroll> = {};
    const andWhere: AndWhere[] = [];

    if (id) where.id = id;
    if (status) where.status = status;
    if (grade_id) where.grade_id = grade_id;
    if (school_id) where.school_id = school_id;
    if (school_year_id) where.school_year_id = school_year_id;
    if (student_id) where.student_id = student_id;
    if (class_period_id) where.class_period_id = class_period_id;

    if (classroom_id) {
      andWhere.push({
        condition: 'classroom.id = :classroomId',
        parameters: { classroomId: classroom_id },
      });
    }

    if (student_name) {
      andWhere.push({
        condition: 'lower(student.name) LIKE lower(:studentName)',
        parameters: { studentName: `${student_name}%` },
      });
    }
    if (student_cpf) {
      andWhere.push({
        condition: 'student.cpf = :studentCpf',
        parameters: { studentCpf: student_cpf },
      });
    }
    if (student_nis) {
      andWhere.push({
        condition: 'student.nis = :studentNis',
        parameters: { studentNis: student_nis },
      });
    }
    if (student_birth_certificate) {
      andWhere.push({
        condition: 'student.birth_certificate = :studentBirthCertificate',
        parameters: { studentBirthCertificate: student_birth_certificate },
      });
    }

    // andWhere.push({
    //   condition: 'enroll_classroom.status = :enrollClassroomStatus',
    //   parameters: { enrollClassroomStatus: 'ACTIVE' },
    // });

    const orderArray = order || [];
    const regexp = /^(.*?)\((desc|asc)\)/;
    const orderObj = orderArray.reduce((acc, item) => {
      const result = regexp.exec(item);
      if (!result) return acc;

      const [, field, ascDesc] = result;
      return { ...acc, [field]: ascDesc.toUpperCase() };
    }, {});

    return {
      join: {
        alias: 'enroll',
        leftJoinAndSelect: {
          enroll_classroom: 'enroll.enroll_classrooms',
          classroom: 'enroll_classroom.classroom',
          student: 'enroll.student',
          student_contact: 'student.student_contacts',
          contact: 'student_contact.contact',
          student_address: 'student.address',
        },
      },
      relations: ['grade', 'class_period', 'school'],
      where: (qb: WhereExpression) => {
        qb.where(where);

        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      },
      order: orderObj,
    };
  }

  public async findOne(filters: FindEnrollDTO): Promise<Enroll | undefined> {
    const enroll = await this.ormRepository.findOne(
      this.makeFindCondition(filters),
    );

    return enroll;
  }

  public async findAllByIds(enroll_ids: string[]): Promise<Enroll[]> {
    const enrolls = await this.ormRepository.find({
      where: { id: In(enroll_ids) },
    });

    return enrolls;
  }

  public async findAll(filters: FindEnrollDTO): Promise<Enroll[]> {
    const enrolls = await this.ormRepository.find({
      ...this.makeFindCondition(filters),
    });

    return enrolls;
  }

  public async count({
    status,
    grade_id,
    school_id,
    school_year_id,
    student_id,
  }: FindEnrollDTO): Promise<EnrollCountResultDTO> {
    const where: FindConditions<Enroll> = {};

    if (status) where.status = status;
    if (grade_id) where.grade_id = grade_id;
    if (school_id) where.school_id = school_id;
    if (school_year_id) where.school_year_id = school_year_id;
    if (student_id) where.student_id = student_id;

    const count = await this.ormRepository.count({ where });

    return { enroll_count: count };
  }

  public async create({
    student_id,
    student,
    school_id,
    grade_id,
    classroom_id,
    school_year_id,
    status,
    origin,
    class_period_id,
    enroll_date,
  }: CreateEnrollDTO): Promise<Enroll> {
    const enroll_classrooms = classroom_id
      ? [{ classroom_id, status: 'ACTIVE' }]
      : [];

    const enroll = this.ormRepository.create({
      student_id,
      student,
      school_id,
      grade_id,
      enroll_classrooms,
      school_year_id,
      class_period_id,
      enroll_date,
      status,
      origin,
    });

    await this.ormRepository.save(enroll);
    return enroll;
  }

  public async update(enroll: Enroll): Promise<Enroll> {
    await this.ormRepository.save(enroll);
    return enroll;
  }
}

export default EnrollsRepository;
