import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddRemovedAtColumnToClassroom1622687041366
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'classrooms',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('classrooms', 'deleted_at');
  }
}
