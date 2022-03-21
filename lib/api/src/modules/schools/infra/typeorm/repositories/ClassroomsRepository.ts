import { FindConditions, getRepository, Repository } from 'typeorm';

import IClassroomsRepository from '@modules/schools/repositories/IClassroomsRepository';
import CreateClassroomDTO from '@modules/schools/dtos/CreateClassroomDTO';
import CountResultDTO from '@modules/schools/dtos/CountResultDTO';
import FindClassroomsDTO from '@modules/schools/dtos/FindClassroomsDTO';

import Classroom from '../entities/Classroom';

class ClassroomsRepository implements IClassroomsRepository {
  private ormRepository: Repository<Classroom>;

  constructor() {
    this.ormRepository = getRepository(Classroom);
  }

  public async findById(classroom_id: string): Promise<Classroom | undefined> {
    const classroom = await this.ormRepository.findOne(classroom_id, {
      relations: ['school', 'grade', 'class_period', 'school_year'],
    });
    return classroom;
  }

  public async count({
    description,
    grade_id,
    class_period_id,
    school_id,
    school_year_id,
  }: FindClassroomsDTO): Promise<CountResultDTO> {
    const where: FindConditions<Classroom> = {
      is_multigrade: false,
    };

    if (description) where.description = description;
    if (grade_id) where.grade_id = grade_id;
    if (class_period_id) where.class_period_id = class_period_id;
    if (school_id) where.school_id = school_id;
    if (school_year_id) where.school_year_id = school_year_id;

    const count = await this.ormRepository.count({ where });
    return { count };
  }

  public async findAll({
    description,
    grade_id,
    class_period_id,
    school_id,
    school_year_id,
    employee_id,
    with_in_multigrades,
    with_multigrades,
  }: FindClassroomsDTO): Promise<Classroom[]> {
    const queryBuilder = this.ormRepository.createQueryBuilder('classroom');

    if (!with_multigrades) {
      queryBuilder.andWhere(`classroom.is_multigrade = :isMultigrade`, {
        isMultigrade: false,
      });
    }

    if (description) {
      queryBuilder.andWhere(`classroom.description = :description`, {
        description,
      });
    }

    if (grade_id) {
      queryBuilder.andWhere(`classroom.grade_id = :gradeId`, {
        gradeId: grade_id,
      });
    }

    if (class_period_id) {
      queryBuilder.andWhere(`classroom.class_period_id = :classPeriod`, {
        classPeriod: class_period_id,
      });
    }

    if (school_id) {
      queryBuilder.andWhere(`classroom.school_id = :schoolId`, {
        schoolId: school_id,
      });
    }

    if (school_year_id) {
      queryBuilder.andWhere(`classroom.school_year_id = :schoolYearId`, {
        schoolYearId: school_year_id,
      });
    }
    if (with_in_multigrades === false) {
      queryBuilder.andWhere(`NOT EXISTS (
        SELECT 1
          FROM multigrades_classrooms as multigrade_classroom
          JOIN classrooms as owner ON (owner.id = multigrade_classroom.owner_id)
         WHERE multigrade_classroom.classroom_id = classroom.id
           AND owner.deleted_at IS NULL
      )`);
    }

    if (employee_id) {
      const classroomTeacherQuery = `
        SELECT 1
          FROM classroom_teacher_school_subjects AS classroom_teacher
         WHERE classroom_teacher.employee_id = :employeeId AND classroom_teacher.classroom_id = classroom.id
      `;

      queryBuilder.andWhere(`EXISTS (${classroomTeacherQuery})`, {
        employeeId: employee_id,
      });
    }

    queryBuilder
      .leftJoinAndSelect('classroom.grade', 'grade')
      .innerJoinAndSelect('classroom.class_period', 'class_period')
      .innerJoinAndSelect('classroom.school', 'school')
      .loadRelationCountAndMap(
        'classroom.enroll_count',
        'classroom.enroll_classrooms',
        'enroll_classroom',
        qb =>
          qb
            .innerJoin(
              'enrolls',
              'enroll',
              'enroll.id = enroll_classroom.enroll_id',
            )
            .where("enroll.status = 'ACTIVE'")
            .andWhere("enroll_classroom.status = 'ACTIVE'"),
      );

    const classrooms = await queryBuilder.getMany();
    return classrooms;
  }

  public async create({
    description,
    class_period_id,
    grade_id,
    school_id,
    school_year_id,
    capacity,
    is_multigrade,
  }: CreateClassroomDTO): Promise<Classroom> {
    const classroom = this.ormRepository.create({
      description,
      class_period_id,
      grade_id,
      school_id,
      school_year_id,
      capacity,
      is_multigrade,
    });

    await this.ormRepository.save(classroom);
    return classroom;
  }

  public async update(classroom: Classroom): Promise<Classroom> {
    const updatedClassroom = await this.ormRepository.save(classroom);
    return updatedClassroom;
  }

  public async delete(classroom: Classroom): Promise<void> {
    await this.ormRepository.softRemove(classroom);
  }
}

export default ClassroomsRepository;
