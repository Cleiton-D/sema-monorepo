import {
  FindConditions,
  FindManyOptions,
  getRepository,
  ObjectLiteral,
  Repository,
  WhereExpression,
  ILike,
  Raw,
} from 'typeorm';

import IClassesRepository from '@modules/classes/repositories/IClassesRepository';
import CreateClassDTO from '@modules/classes/dtos/CreateClassDTO';
import FindClassDTO from '@modules/classes/dtos/FindClassDTO';
import CountResultDTO from '@modules/classes/dtos/CountResultDTO';

import Class from '../entities/Class';

type AndWhere = {
  condition: string;
  parameters?: ObjectLiteral;
};

class ClassesRepository implements IClassesRepository {
  private ormRepository: Repository<Class>;

  constructor() {
    this.ormRepository = getRepository(Class);
  }

  private makeFilterSelect({
    classroom_id,
    employee_id,
    school_subject_id,
    school_id,
    class_date,
    class_period_id,
    grade_id,
    status,
    taught_content,
    limit,
    order: orderDirection,
    sortBy,
  }: FindClassDTO): FindManyOptions<Class> {
    const where: FindConditions<Class> = {};
    const andWhere: AndWhere[] = [];

    const order: Record<string, 'ASC' | 'DESC'> = {};

    if (classroom_id) where.classroom_id = classroom_id;
    if (employee_id) where.employee_id = employee_id;
    if (school_subject_id) where.school_subject_id = school_subject_id;
    if (status) where.status = status;
    if (taught_content) where.taught_content = ILike(`%${taught_content}%`);

    if (class_date) {
      const [date] = class_date.split('T');

      where.class_date = Raw(alias => `CAST(${alias} AS DATE) = :classDate`, {
        classDate: date,
      });
    }
    if (school_id) {
      andWhere.push({
        condition: 'classroom.school_id = :schoolId',
        parameters: { schoolId: school_id },
      });
    }
    if (class_period_id) {
      andWhere.push({
        condition: 'classroom.class_period_id = :classPeriodId',
        parameters: { classPeriodId: class_period_id },
      });
    }
    if (grade_id) {
      andWhere.push({
        condition: 'classroom.grade_id = :gradeId',
        parameters: { gradeId: grade_id },
      });
    }

    if (sortBy) {
      order[sortBy] = orderDirection || 'DESC';
    }

    return {
      where: (qb: WhereExpression) => {
        qb.where(where);
        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      },
      order,
      take: limit,
      join: {
        alias: 'class',
        leftJoinAndSelect: {
          classroom: 'class.classroom',
          school_subject: 'class.school_subject',
          employee: 'class.employee',
        },
      },
    };
  }

  public async findById(class_id: string): Promise<Class | undefined> {
    const classEntity = await this.ormRepository.findOne({
      where: {
        id: class_id,
      },
      relations: ['classroom', 'school_subject', 'employee'],
    });
    return classEntity;
  }

  public async findAll(filters: FindClassDTO): Promise<Class[]> {
    const classes = await this.ormRepository.find(
      this.makeFilterSelect(filters),
    );
    return classes;
  }

  public async count({
    classroom_id,
    employee_id,
    school_subject_id,
    school_id,
  }: FindClassDTO): Promise<CountResultDTO> {
    const where: FindConditions<Class> = {};
    const andWhere: AndWhere[] = [];

    if (classroom_id) where.classroom_id = classroom_id;
    if (employee_id) where.employee_id = employee_id;
    if (school_subject_id) where.school_subject_id = school_subject_id;
    if (school_id) {
      andWhere.push({
        condition: 'classroom.school_id = :schoolId',
        parameters: { schoolId: school_id },
      });
    }

    const count = await this.ormRepository.count({
      where: (qb: WhereExpression) => {
        qb.where(where);
        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      },
      join: {
        alias: 'class',
        leftJoinAndSelect: {
          classroom: 'class.classroom',
        },
      },
    });
    return { count };
  }

  public async create({
    employee_id,
    school_subject_id,
    classroom_id,
    period,
    date_start,
    class_date,
    taught_content,
    school_term,
  }: CreateClassDTO): Promise<Class> {
    const classEntity = this.ormRepository.create({
      employee_id,
      school_subject_id,
      classroom_id,
      period,
      date_start,
      class_date,
      taught_content,
      status: 'PROGRESS',
      school_term,
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
