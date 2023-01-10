import { SelectQueryBuilder, Repository, FindOptionsWhere } from 'typeorm';

import { dataSource } from '@config/data_source';

import IGradesRepository from '@modules/education_core/repositories/IGradesRepository';
import CreateGradeDTO from '@modules/education_core/dtos/CreateGradeDTO';
import CountResultDTO from '@modules/education_core/dtos/CountResultDTO';
import FindGradeDTO from '@modules/education_core/dtos/FindGradeDTO';
import Grade from '../entities/Grade';

class GradesRepository implements IGradesRepository {
  private ormRepository: Repository<Grade>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Grade);
  }

  private createQueryBuilder(
    where: FindOptionsWhere<Grade>,
  ): SelectQueryBuilder<Grade> {
    const multidisciplinary_query = `
      SELECT 1
        FROM "grade_school_subjects" "grade_school_subject"
  INNER JOIN "school_subjects" "school_subject" ON ("school_subject"."id" = "grade_school_subject"."school_subject_id")
       WHERE "school_subject"."is_multidisciplinary" IS TRUE
         AND "grade_school_subject"."grade_id" = "grade"."id"
         AND "grade_school_subject"."deleted_at" is null
       LIMIT 1
    `;

    const queryBuilder = this.ormRepository
      .createQueryBuilder('grade')
      .addSelect(`EXISTS(${multidisciplinary_query})`, 'is_multidisciplinary')
      .where(where);

    return queryBuilder;
  }

  public async findById(grade_id: string): Promise<Grade | undefined> {
    const queryBuilder = this.createQueryBuilder({ id: grade_id });

    const grade = await queryBuilder.getOne();
    return grade ?? undefined;
  }

  public async findAll({ school_year_id }: FindGradeDTO = {}): Promise<
    Grade[]
  > {
    const where: FindOptionsWhere<Grade> = {};
    if (school_year_id) where.school_year_id = school_year_id;

    const queryBuilder = this.createQueryBuilder(where);
    const grades = await queryBuilder.getMany();
    return grades;
  }

  public async findWithAfterOf(after_of: string): Promise<Grade | undefined> {
    const queryBuilder = this.createQueryBuilder({ after_of });
    const grade = await queryBuilder.getOne();
    return grade ?? undefined;
  }

  public async count({
    school_year_id,
  }: FindGradeDTO = {}): Promise<CountResultDTO> {
    const where: FindOptionsWhere<Grade> = {};
    if (school_year_id) where.school_year_id = school_year_id;

    const queryBuilder = this.createQueryBuilder(where);

    const count = await queryBuilder.getCount();
    return { count };
  }

  public async create({
    description,
    after_of,
    school_year_id,
  }: CreateGradeDTO): Promise<Grade> {
    const grade = this.ormRepository.create({
      description,
      after_of,
      school_year_id,
    });
    await this.ormRepository.save(grade);

    return grade;
  }

  public async delete(grade: Grade): Promise<void> {
    await this.ormRepository.softRemove(grade);
  }
}

export default GradesRepository;
