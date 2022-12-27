import { MigrationInterface, QueryRunner } from 'typeorm';

export default class SetEnglishAsOptionalSchoolSubject1670979852442
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE grade_school_subjects SET is_required = false WHERE school_subject_id = '72f97c95-2ac0-4b80-bc66-573ed551eab5'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE grade_school_subjects SET is_required = true WHERE school_subject_id = '72f97c95-2ac0-4b80-bc66-573ed551eab5'
    `);
  }
}
