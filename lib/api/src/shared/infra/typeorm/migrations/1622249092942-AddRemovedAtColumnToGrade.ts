import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddRemovedAtColumnToGrade1622249092942
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'grades',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('grades', 'deleted_at');
  }
}
