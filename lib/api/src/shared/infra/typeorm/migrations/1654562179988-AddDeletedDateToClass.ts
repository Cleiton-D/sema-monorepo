import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddDeletedDateToClass1654562179988
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'classes',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'attendances',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'multiclasses',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('classes', 'deleted_at');
    await queryRunner.dropColumn('attendances', 'deleted_at');
    await queryRunner.dropColumn('multiclasses', 'deleted_at');
  }
}
