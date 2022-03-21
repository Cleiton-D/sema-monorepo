import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddTypesToSchoolTermEnum1641774649014
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE SchoolTerm ADD VALUE 'FIRST-REC';`);
    await queryRunner.query(`ALTER TYPE SchoolTerm ADD VALUE 'SECOND-REC';`);
    await queryRunner.query(`ALTER TYPE SchoolTerm ADD VALUE 'EXAM';`);
  }

  public async down(): Promise<void> {
    console.log('reverting...');
  }
}
