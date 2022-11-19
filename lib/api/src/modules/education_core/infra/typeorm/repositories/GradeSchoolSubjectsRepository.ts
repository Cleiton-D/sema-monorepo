import {
  FindOptionsWhere,
  Repository,
  IsNull,
  SelectQueryBuilder,
  ObjectLiteral,
} from 'typeorm';

import { dataSource } from '@config/data_source';

import IGradeSchoolSubjectsRepository from '@modules/education_core/repositories/IGradeSchoolSubjectsRepository';
import CreateGradeSchoolSubjectDTO from '@modules/education_core/dtos/CreateGradeSchoolSubjectDTO';
import FindGradeSchoolSubjectDTO from '@modules/education_core/dtos/FindGradeSchoolSubjectDTO';

import GradeSchoolSubject from '../entities/GradeSchoolSubject';

type AndWhere = {
  condition: string;
  parameters?: ObjectLiteral;
};

class GradeSchoolSubjectsRepository implements IGradeSchoolSubjectsRepository {
  private ormRepository: Repository<GradeSchoolSubject>;

  constructor() {
    this.ormRepository = dataSource.getRepository(GradeSchoolSubject);
  }

  private createQueryBuilder({
    id,
    grade_id,
    school_subject_id,
    workload,
    is_multidisciplinary,
    include_multidisciplinary,
  }: FindGradeSchoolSubjectDTO): SelectQueryBuilder<GradeSchoolSubject> {
    const where: FindOptionsWhere<GradeSchoolSubject> = {
      deleted_at: IsNull(),
    };
    const andWhere: AndWhere[] = [];

    if (id) where.id = id;
    if (grade_id) where.grade_id = grade_id;
    if (school_subject_id) where.school_subject_id = school_subject_id;
    if (workload) where.workload = workload;
    if (!include_multidisciplinary && !is_multidisciplinary) {
      andWhere.push({
        condition: 'school_subject.is_multidisciplinary = :isMultidisciplinary',
        parameters: { isMultidisciplinary: false },
      });
    } else if (is_multidisciplinary) {
      andWhere.push({
        condition: 'school_subject.is_multidisciplinary = :isMultidisciplinary',
        parameters: { isMultidisciplinary: true },
      });
    }

    const workload_query = `
      SELECT  CASE
		  	        WHEN COUNT(1) = 0 THEN
                  "grade_school_subject"."workload"
                ELSE "grade_school_subject2"."workload"
              END
        FROM "grade_school_subjects" "grade_school_subject2"
  INNER JOIN "school_subjects" "school_subject2" ON ("school_subject2"."id" = "grade_school_subject2"."school_subject_id")
       WHERE "school_subject2"."is_multidisciplinary" IS TRUE
         AND "grade_school_subject2"."grade_id" = "grade"."id"
         AND "grade_school_subject2"."deleted_at" is null
    GROUP BY "grade_school_subject2"."workload"
       LIMIT 1
    `;

    const queryBuilder = this.ormRepository
      .createQueryBuilder('grade_school_subject')
      .select()
      .where(qb => {
        qb.where(where);
        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      })
      .addSelect(`(${workload_query})`, 'calculated_workload')
      .innerJoinAndSelect('grade_school_subject.grade', 'grade')
      .innerJoinAndSelect(
        'grade_school_subject.school_subject',
        'school_subject',
      )
      .orderBy('school_subject.index', 'ASC');

    return queryBuilder;
  }

  public async find(
    filters: FindGradeSchoolSubjectDTO,
  ): Promise<GradeSchoolSubject[]> {
    const queryBuilder = this.createQueryBuilder(filters);

    const gradeSchoolSubjects = await queryBuilder.getMany();
    return gradeSchoolSubjects;
  }

  public async findOne(
    filters: FindGradeSchoolSubjectDTO,
  ): Promise<GradeSchoolSubject | undefined> {
    const queryBuilder = this.createQueryBuilder(filters);

    const gradeSchoolSubject = await queryBuilder.getOne();
    return gradeSchoolSubject ?? undefined;
  }

  public async create({
    grade_id,
    school_subject_id,
    workload,
  }: CreateGradeSchoolSubjectDTO): Promise<GradeSchoolSubject> {
    const gradeSchoolSubject = await this.ormRepository.create({
      grade_id,
      school_subject_id,
      workload,
    });

    await this.ormRepository.save(gradeSchoolSubject);
    return gradeSchoolSubject;
  }

  public async createMany(
    data: CreateGradeSchoolSubjectDTO[],
  ): Promise<GradeSchoolSubject[]> {
    const gradeSchoolSubjects = data.map(
      ({ grade_id, school_subject_id, workload }) =>
        this.ormRepository.create({
          grade_id,
          school_subject_id,
          workload,
        }),
    );

    await this.ormRepository.save(gradeSchoolSubjects);
    return gradeSchoolSubjects;
  }

  public async update(
    gradeSchoolSubject: GradeSchoolSubject,
  ): Promise<GradeSchoolSubject> {
    await this.ormRepository.save(gradeSchoolSubject);
    return gradeSchoolSubject;
  }

  public async delete(gradeSchoolSubject: GradeSchoolSubject): Promise<void> {
    await this.ormRepository.softRemove(gradeSchoolSubject);
  }
}

export default GradeSchoolSubjectsRepository;
