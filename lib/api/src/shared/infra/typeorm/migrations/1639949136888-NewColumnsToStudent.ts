import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class NewColumnsToStudent1639949136888
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('students', [
      new TableColumn({
        name: 'breed',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'naturalness',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'naturalness_uf',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'identity_document',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'nationality',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.dropColumn('students', 'breed'),
      queryRunner.dropColumn('students', 'naturalness'),
      queryRunner.dropColumn('students', 'naturalness_uf'),
      queryRunner.dropColumn('students', 'identity_document'),
      queryRunner.dropColumn('students', 'nationality'),
    ]);
  }
}
