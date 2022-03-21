import { MigrationInterface, QueryRunner } from 'typeorm';

export default class ModifyPersonBirthDateToTimestamp1630630682693
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      ALTER TABLE persons ALTER COLUMN birth_date TYPE TIMESTAMP;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      ALTER TABLE persons ALTER COLUMN birth_date TYPE TIMESTAMP without time zone;
    `);
  }
}
