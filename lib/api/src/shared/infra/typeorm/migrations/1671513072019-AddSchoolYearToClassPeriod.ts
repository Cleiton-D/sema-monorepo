import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddSchoolYearToClassPeriod1671513072019
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'class_periods',
      new TableColumn({
        name: 'school_year_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'class_periods',
      new TableForeignKey({
        name: 'ClassPeriodSchoolYear',
        columnNames: ['school_year_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'school_years',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('class_periods', 'ClassPeriodSchoolYear');
    await queryRunner.dropColumn('class_periods', 'school_year_id');
  }
}
