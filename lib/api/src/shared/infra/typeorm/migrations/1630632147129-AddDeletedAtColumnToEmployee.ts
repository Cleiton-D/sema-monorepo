import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddDeletedAtColumnToEmployee1630632147129
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'employees',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('employees', 'deleted_at');
  }
}
