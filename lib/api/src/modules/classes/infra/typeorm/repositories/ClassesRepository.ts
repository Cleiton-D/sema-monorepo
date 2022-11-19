import {
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  WhereExpressionBuilder,
  ILike,
  Raw,
} from 'typeorm';
import { parseISO } from 'date-fns';

import { dataSource } from '@config/data_source';

import IClassesRepository from '@modules/classes/repositories/IClassesRepository';
import CreateClassDTO from '@modules/classes/dtos/CreateClassDTO';
import FindClassDTO from '@modules/classes/dtos/FindClassDTO';
import CountResultDTO from '@modules/classes/dtos/CountResultDTO';

import { PaginatedResponse } from '@shared/dtos';
import Class from '../entities/Class';

type AndWhere = {
  condition: string;
  parameters?: ObjectLiteral;
};

class ClassesRepository implements IClassesRepository {
  private ormRepository: Repository<Class>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Class);
  }

  private async createQueryBuilder({
    classroom_id,
    employee_id,
    school_subject_id,
    school_id,
    class_date,
    class_period_id,
    grade_id,
    status,
    taught_content,
    school_term,
    limit,
    order: orderDirection,
    sortBy,
    before,
    period,
    id,
  }: FindClassDTO) {
    const where: FindOptionsWhere<Class> = {};
    const andWhere: AndWhere[] = [];

    // if (classroom_id) where.classroom_id = classroom_id;
    if (employee_id) where.employee_id = employee_id;
    if (school_subject_id) where.school_subject_id = school_subject_id;
    if (status) where.status = status;
    if (taught_content) where.taught_content = ILike(`%${taught_content}%`);
    if (period) where.period = period;
    if (id) where.id = id;
    if (school_term) where.school_term = school_term;

    if (classroom_id) {
      andWhere.push({
        condition: `
          (classroom.id = :classroomId OR
            EXISTS (
              SELECT 1
                FROM multiclasses multiclass
               WHERE multiclass.classroom_id = :classroomId
                 AND multiclass.class_id = class.id
            )
          )`,
        parameters: { classroomId: classroom_id },
      });
    }

    if (before) {
      const oldClass = await this.ormRepository.findOne({
        where: { id: before },
      });
      if (oldClass) {
        andWhere.push({
          condition: 'class.class_date <= :oldClassDate',
          parameters: { oldClassDate: oldClass?.class_date },
        });
      }
    }

    // if (classroom_id) {
    //   andWhere.push({
    //     condition:
    //       '(classroom.id = :classroomId OR enroll_classroom.id = :classroomId)',
    //     parameters: { classroomId: classroom_id },
    //   });
    // }

    if (class_date) {
      const parsedDate = parseISO(class_date);

      where.class_date = Raw(alias => `CAST(${alias} AS DATE) = :classDate`, {
        classDate: parsedDate,
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

    const queryBuilder = this.ormRepository
      .createQueryBuilder('class')
      .select()
      .addSelect(`school_term_period.status = 'ACTIVE'`, 'edit_available')
      // .addSelect('school_term_period.status', 'edit_available')
      .where((qb: WhereExpressionBuilder) => {
        qb.where(where);
        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      })
      .take(limit)
      .leftJoinAndSelect('class.classroom', 'classroom')
      // .leftJoinAndSelect('class.enroll_classroom', 'enroll_classroom')
      .leftJoinAndSelect('class.school_subject', 'school_subject')
      .leftJoinAndSelect('class.employee', 'employee')
      .leftJoin(
        'school_term_periods',
        'school_term_period',
        'CAST(school_term_period.school_term AS varchar) = CAST(class.school_term AS varchar)',
      );

    if (sortBy) {
      queryBuilder.addOrderBy(`class.${sortBy}`, orderDirection || 'DESC');
    }

    return queryBuilder;
  }

  public async findOne(filters: FindClassDTO): Promise<Class | undefined> {
    const queryBuilder = await this.createQueryBuilder(filters);

    const classEntity = await queryBuilder.getOne();
    return classEntity || undefined;
  }

  public async findAll({
    page,
    size,
    ...filters
  }: FindClassDTO): Promise<PaginatedResponse<Class>> {
    const queryBuilder = await this.createQueryBuilder(filters);
    const total = await queryBuilder.getCount();

    if (size) {
      queryBuilder.limit(size);
      if (page) {
        queryBuilder.offset((page - 1) * size);
      }
    }

    const classes = await queryBuilder.getMany();

    return { page: page || 1, size: size || total, total, items: classes };
  }

  public async count({
    classroom_id,
    employee_id,
    school_subject_id,
    school_id,
  }: FindClassDTO): Promise<CountResultDTO> {
    const where: FindOptionsWhere<Class> = {};
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

    // if (before) {
    //   andWhere.push({
    //     condition: `EXISTS (
    //       SELECT 1
    //         FROM classes old_class
    //        WHERE old_class.id = before
    //     )`,
    //   });
    // }

    const queryBuilder = this.ormRepository
      .createQueryBuilder('class')
      .select()
      .where((qb: WhereExpressionBuilder) => {
        qb.where(where);
        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      })
      .leftJoinAndSelect('class.classroom', 'classroom');

    const count = await queryBuilder.getCount();
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
    multiclasses,
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
      multiclasses,
    });

    await this.ormRepository.save(classEntity);
    return classEntity;
  }

  public async update(classEntity: Class): Promise<Class> {
    await this.ormRepository.save(classEntity);
    return classEntity;
  }

  public async delete(classEntity: Class): Promise<void> {
    const entity = await this.ormRepository.findOneOrFail({
      where: { id: classEntity.id },
      relations: ['attendances', 'multiclasses'],
    });

    await this.ormRepository.softRemove(entity);
  }
}

export default ClassesRepository;
