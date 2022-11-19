import {
  FindOptionsWhere,
  In,
  ObjectLiteral,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';

import { dataSource } from '@config/data_source';

import IEnrollsRepository from '@modules/enrolls/repositories/IEnrollsRepository';
import CreateEnrollDTO from '@modules/enrolls/dtos/CreateEnrollDTO';
import FindEnrollDTO from '@modules/enrolls/dtos/FindEnrollDTO';
import EnrollCountResultDTO from '@modules/enrolls/dtos/EntollCountResultDTO';

import { PaginatedResponse } from '@shared/dtos';

import Enroll from '../entities/Enroll';

type AndWhere = {
  condition: string;
  parameters?: ObjectLiteral;
};
class EnrollsRepository implements IEnrollsRepository {
  private ormRepository: Repository<Enroll>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Enroll);
  }

  private createQueryBuilder({
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
    const where: FindOptionsWhere<Enroll> = {};
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

    const queryBuilder = this.ormRepository
      .createQueryBuilder('enroll')
      .select()

      .where((qb: WhereExpressionBuilder) => {
        qb.where(where);

        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      })
      .leftJoinAndSelect('enroll.enroll_classrooms', 'enroll_classroom')
      .leftJoinAndSelect('enroll_classroom.classroom', 'classroom')
      .leftJoinAndSelect('enroll.student', 'student')
      .leftJoinAndSelect('student.student_contacts', 'student_contact')
      .leftJoinAndSelect('student_contact.contact', 'contact')
      .leftJoinAndSelect('student.address', 'student_address')
      .leftJoinAndSelect('enroll.grade', 'grade')
      .leftJoinAndSelect('enroll.class_period', 'class_period')
      .leftJoinAndSelect('enroll.school', 'school');

    const orderArray = order || [];
    const regexp = /^(.*?)\((desc|asc)\)/;

    orderArray.forEach(item => {
      const result = regexp.exec(item);
      if (!result) return;

      const [, field, ascDesc] = result;
      queryBuilder.addOrderBy(
        `enroll.${field}`,
        ascDesc.toUpperCase() as 'ASC' | 'DESC',
      );
    });

    return queryBuilder;
  }

  public async findOne(filters: FindEnrollDTO): Promise<Enroll | undefined> {
    const queryBuilder = this.createQueryBuilder(filters);

    const enroll = await queryBuilder.getOne();

    return enroll ?? undefined;
  }

  public async findAllByIds(enroll_ids: string[]): Promise<Enroll[]> {
    const enrolls = await this.ormRepository.find({
      where: { id: In(enroll_ids) },
    });

    return enrolls;
  }

  public async findAll(
    filters: FindEnrollDTO,
  ): Promise<PaginatedResponse<Enroll>> {
    const queryBuilder = this.createQueryBuilder(filters);
    const total = await queryBuilder.getCount();

    const { page, size } = filters;
    if (size) {
      queryBuilder.limit(size);
      if (page) {
        queryBuilder.offset((page - 1) * size);
      }
    }

    const enrolls = await queryBuilder.getMany();

    return { page: page || 1, size: size || total, total, items: enrolls };
  }

  public async count({
    status,
    grade_id,
    school_id,
    school_year_id,
    student_id,
  }: FindEnrollDTO): Promise<EnrollCountResultDTO> {
    const where: FindOptionsWhere<Enroll> = {};

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
