import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddSchoolYearToSchoolTeachers1671512535865
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'school_teachers',
      new TableColumn({
        name: 'school_year_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'school_teachers',
      new TableForeignKey({
        name: 'SchoolTeacherSchoolYear',
        columnNames: ['school_year_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'school_years',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'school_teachers',
      'SchoolTeacherSchoolYear',
    );
    await queryRunner.dropColumn('school_teachers', 'school_year_id');
  }
}
