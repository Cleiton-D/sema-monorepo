import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class addClassPeriodToEnroll1642879594454
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'enrolls',
      new TableColumn({
        name: 'class_period_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'enrolls',
      new TableForeignKey({
        name: 'EnrollClassPeriod',
        columnNames: ['class_period_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'class_periods',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('enrolls', 'EnrollClassPeriod');
    await queryRunner.dropColumn('enrolls', 'class_period_id');
  }
}
