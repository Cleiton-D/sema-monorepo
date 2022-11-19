import { MigrationInterface, QueryRunner } from 'typeorm';

export default class SetBreaskTimeAsNullable1652746868529
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE class_periods ALTER COLUMN break_time DROP NOT NULL;
    `);
    await queryRunner.query(`
      ALTER TABLE class_periods ALTER COLUMN break_time_start DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    ALTER TABLE class_periods ALTER COLUMN break_time SET NOT NULL;
  `);
    await queryRunner.query(`
    ALTER TABLE class_periods ALTER COLUMN break_time_start SET NOT NULL;
  `);
  }
}
