import { MigrationInterface, QueryRunner } from 'typeorm';

export default class SetGradeIdAsOptional1645666479724
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE classrooms ALTER COLUMN grade_id DROP NOT NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE classrooms ALTER COLUMN grade_id SET NOT NULL;`,
    );
  }
}
