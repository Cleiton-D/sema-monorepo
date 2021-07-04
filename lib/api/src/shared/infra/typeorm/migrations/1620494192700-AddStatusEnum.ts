import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddStatusEnum1620494192700 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      CREATE TYPE Status AS ENUM (
        'ACTIVE',
        'INACTIVE',
        'PENDING'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      DROP TYPE Status;
    `);
  }
}
