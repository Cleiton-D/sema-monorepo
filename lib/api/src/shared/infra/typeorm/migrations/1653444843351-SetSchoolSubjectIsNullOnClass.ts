import { MigrationInterface, QueryRunner } from 'typeorm';

export default class SetSchoolSubjectIsNullOnClass1653444843351
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE classes ALTER COLUMN school_subject_id DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE classes ALTER COLUMN school_subject_id SET NOT NULL;
    `);
  }
}
