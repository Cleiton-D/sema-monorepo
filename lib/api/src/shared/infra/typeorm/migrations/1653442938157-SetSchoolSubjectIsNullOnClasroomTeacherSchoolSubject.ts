import { MigrationInterface, QueryRunner } from 'typeorm';

export default class SetSchoolSubjectIsNullOnClasroomTeacherSchoolSubject1653442938157
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE classroom_teacher_school_subjects ALTER COLUMN school_subject_id DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE classroom_teacher_school_subjects ALTER COLUMN school_subject_id SET NOT NULL;
    `);
  }
}
