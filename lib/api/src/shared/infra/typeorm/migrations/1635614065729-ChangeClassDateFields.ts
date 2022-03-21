import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class ChangeClassDateFields1635614065729
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropColumn('classes', 'class_date');
    // await queryRunner.dropColumn('classes', 'time_start');
    // await queryRunner.dropColumn('classes', 'time_end');

    await queryRunner.addColumn(
      'classes',
      new TableColumn({
        name: 'period',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'classes',
      new TableColumn({
        name: 'date_start',
        type: 'timestamp',
      }),
    );

    await queryRunner.addColumn(
      'classes',
      new TableColumn({
        name: 'date_end',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('classes', 'date_end');
    await queryRunner.dropColumn('classes', 'date_start');
    await queryRunner.dropColumn('classes', 'period');

    await queryRunner.addColumn(
      'classes',
      new TableColumn({
        name: 'class_date',
        type: 'timestamp',
      }),
    );
    await queryRunner.addColumn(
      'classes',
      new TableColumn({
        name: 'time_start',
        type: 'time',
      }),
    );

    await queryRunner.addColumn(
      'classes',
      new TableColumn({
        name: 'time_end',
        type: 'time',
        isNullable: true,
      }),
    );
  }
}
