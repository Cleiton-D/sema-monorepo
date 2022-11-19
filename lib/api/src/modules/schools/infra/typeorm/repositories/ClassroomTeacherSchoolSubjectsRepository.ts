import {
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';

import { dataSource } from '@config/data_source';

import IClassroomTeacherSchoolSubjectsRepository from '@modules/schools/repositories/IClassroomTeacherSchoolSubjectsRepository';
import CreateClassroomTeacherSchoolSubjectDTO from '@modules/schools/dtos/CreateClassroomTeacherSchoolSubjectDTO';
import FindClassroomTeacherSchoolSubjectDTO from '@modules/schools/dtos/FindClassroomTeacherSchoolSubjectDTO';
import ClassroomTeacherSchoolSubject from '../entities/ClassroomTeacherSchoolSubject';

type AndWhere = {
  condition: string;
  parameters?: ObjectLiteral;
};

class ClassroomTeacherSchoolSubjectsRepository
  implements IClassroomTeacherSchoolSubjectsRepository
{
  private ormRepository: Repository<ClassroomTeacherSchoolSubject>;

  constructor() {
    this.ormRepository = dataSource.getRepository(
      ClassroomTeacherSchoolSubject,
    );
  }

  public async findOne({
    id,
    classroom_id,
    school_subject_id,
    employee_id,
    school_id,
  }: FindClassroomTeacherSchoolSubjectDTO): Promise<
    ClassroomTeacherSchoolSubject | undefined
  > {
    const where: FindOptionsWhere<ClassroomTeacherSchoolSubject> = {};
    const andWhere: AndWhere[] = [];

    if (id) where.id = id;
    if (classroom_id) where.classroom_id = classroom_id;
    if (school_subject_id) where.school_subject_id = school_subject_id;
    if (employee_id) where.employee_id = employee_id;
    if (school_id) {
      andWhere.push({
        condition: 'classroom.school_id = :schoolId',
        parameters: { schoolId: school_id },
      });
    }

    const queryBuilder = this.ormRepository
      .createQueryBuilder('classroom_teacher_school_subject')
      .select()
      .where((qb: WhereExpressionBuilder) => {
        qb.where(where);
        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      })
      .leftJoinAndSelect(
        'classroom_teacher_school_subject.employee',
        'employee',
      )
      .leftJoinAndSelect(
        'classroom_teacher_school_subject.classroom',
        'classroom',
      )
      .leftJoinAndSelect(
        'classroom_teacher_school_subject.school_subject',
        'school_subject',
      );

    const classroomTeacherSchoolSubject = await queryBuilder.getOne();
    return classroomTeacherSchoolSubject ?? undefined;
  }

  public async findAll({
    id,
    classroom_id,
    school_subject_id,
    employee_id,
    school_id,
    is_multidisciplinary,
  }: FindClassroomTeacherSchoolSubjectDTO): Promise<
    ClassroomTeacherSchoolSubject[]
  > {
    const where: FindOptionsWhere<ClassroomTeacherSchoolSubject> = {};
    const andWhere: AndWhere[] = [];

    if (id) where.id = id;
    if (classroom_id) where.classroom_id = classroom_id;
    if (school_subject_id) where.school_subject_id = school_subject_id;
    if (employee_id) where.employee_id = employee_id;
    if (typeof is_multidisciplinary !== 'undefined') {
      const multidisciplinary_query = `
        SELECT 1
          FROM "grade_school_subjects" "grade_school_subject"
    INNER JOIN "school_subjects" "school_subject2" ON ("school_subject2"."id" = "grade_school_subject"."school_subject_id")
         WHERE "school_subject2"."is_multidisciplinary" IS TRUE
           AND "grade_school_subject"."grade_id" = "grade"."id"
           AND "grade_school_subject"."deleted_at" is null
           AND "school_subject2"."id" = "school_subject"."id"
         LIMIT 1
    `;

      if (!is_multidisciplinary) {
        andWhere.push({
          condition: `NOT EXISTS (${multidisciplinary_query})`,
        });
      } else {
        andWhere.push({
          condition: `EXISTS (${multidisciplinary_query})`,
        });
      }
    }
    if (school_id) {
      andWhere.push({
        condition: 'classroom.school_id = :schoolId',
        parameters: { schoolId: school_id },
      });
    }

    const queryBuilder = this.ormRepository
      .createQueryBuilder('classroom_teacher_school_subject')
      .select()
      .where((qb: WhereExpressionBuilder) => {
        qb.where(where);
        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      })
      .leftJoinAndSelect(
        'classroom_teacher_school_subject.employee',
        'employee',
      )
      .leftJoinAndSelect(
        'classroom_teacher_school_subject.classroom',
        'classroom',
      )
      .leftJoinAndSelect(
        'classroom_teacher_school_subject.school_subject',
        'school_subject',
      )
      .leftJoin('classroom.grade', 'grade');

    const classroomTeacherSchoolSubjects = await queryBuilder.getMany();

    return classroomTeacherSchoolSubjects;
  }

  public async create({
    classroom_id,
    employee_id,
    school_subject_id,
  }: CreateClassroomTeacherSchoolSubjectDTO): Promise<ClassroomTeacherSchoolSubject> {
    const classroomTeacherSchoolSubject = this.ormRepository.create({
      classroom_id,
      employee_id,
      school_subject_id,
    });
    await this.ormRepository.save(classroomTeacherSchoolSubject);

    return classroomTeacherSchoolSubject;
  }

  public async createMany(
    data: CreateClassroomTeacherSchoolSubjectDTO[],
  ): Promise<ClassroomTeacherSchoolSubject[]> {
    const classroomTeacherSchoolSubjects = data.map(
      ({ classroom_id, school_subject_id, employee_id }) =>
        this.ormRepository.create({
          classroom_id,
          school_subject_id,
          employee_id,
        }),
    );
    await this.ormRepository.save(classroomTeacherSchoolSubjects);

    return classroomTeacherSchoolSubjects;
  }

  public async delete(
    classroomTeacherSchoolSubject: ClassroomTeacherSchoolSubject,
  ): Promise<void> {
    await this.ormRepository.softRemove(classroomTeacherSchoolSubject);
  }

  public async deleteMany(
    items: ClassroomTeacherSchoolSubject[],
  ): Promise<void> {
    await Promise.all(items.map(item => this.ormRepository.softRemove(item)));
  }
}

export default ClassroomTeacherSchoolSubjectsRepository;
