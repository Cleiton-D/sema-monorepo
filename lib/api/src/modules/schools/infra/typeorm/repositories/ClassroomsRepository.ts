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
    const classroom = await this.ormRepository.findOne(classroom_id);
    return classroom;
  }

  public async count({
    description,
    grade_id,
    class_period,
    school_id,
    school_year_id,
  }: FindClassroomsDTO): Promise<CountResultDTO> {
    const where: FindConditions<Classroom> = {};

    if (description) where.description = description;
    if (grade_id) where.grade_id = grade_id;
    if (class_period) where.class_period = class_period;
    if (school_id) where.school_id = school_id;
    if (school_year_id) where.school_year_id = school_year_id;

    const count = await this.ormRepository.count({ where });
    return { count };
  }

  public async findAll({
    description,
    grade_id,
    class_period,
    school_id,
    school_year_id,
  }: FindClassroomsDTO): Promise<Classroom[]> {
    const queryBuilder = this.ormRepository.createQueryBuilder('classroom');

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

    if (class_period) {
      queryBuilder.andWhere(`classroom.class_period = :classPeriod`, {
        classPeriod: class_period,
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

    queryBuilder
      .innerJoinAndSelect('classroom.grade', 'grade')
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
    class_period,
    grade_id,
    school_id,
    school_year_id,
  }: CreateClassroomDTO): Promise<Classroom> {
    const classroom = this.ormRepository.create({
      description,
      class_period,
      grade_id,
      school_id,
      school_year_id,
    });

    await this.ormRepository.save(classroom);
    return classroom;
  }

  public async delete(classroom: Classroom): Promise<void> {
    await this.ormRepository.softRemove(classroom);
  }
}

export default ClassroomsRepository;
