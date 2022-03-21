import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class NewColumnsToEnroll1639948739381
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'enrolls',
      new TableColumn({
        name: 'origin',
        type: 'enum',
        enum: ['NEW', 'REPEATING'],
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('enrolls', 'origin');
  }
}
