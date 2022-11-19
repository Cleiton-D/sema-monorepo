import { SelectQueryBuilder, Repository, FindOptionsWhere } from 'typeorm';

import { dataSource } from '@config/data_source';

import IGradesRepository from '@modules/education_core/repositories/IGradesRepository';
import CreateGradeDTO from '@modules/education_core/dtos/CreateGradeDTO';
import CountResultDTO from '@modules/education_core/dtos/CountResultDTO';
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

  public async findAll(): Promise<Grade[]> {
    const queryBuilder = this.createQueryBuilder({});
    const grades = await queryBuilder.getMany();
    return grades;
  }

  public async findWithAfterOf(after_of: string): Promise<Grade | undefined> {
    const queryBuilder = this.createQueryBuilder({ after_of });
    const grade = await queryBuilder.getOne();
    return grade ?? undefined;
  }

  public async count(): Promise<CountResultDTO> {
    const queryBuilder = this.createQueryBuilder({});

    const count = await queryBuilder.getCount();
    return { count };
  }

  public async create({
    description,
    after_of,
  }: CreateGradeDTO): Promise<Grade> {
    const grade = this.ormRepository.create({
      description,
      after_of,
    });
    await this.ormRepository.save(grade);

    return grade;
  }

  public async delete(grade: Grade): Promise<void> {
    await this.ormRepository.softRemove(grade);
  }
}

export default GradesRepository;
