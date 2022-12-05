import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddSchoolYearToGrades1671511863318
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'grades',
      new TableColumn({
        name: 'school_year_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'grades',
      new TableForeignKey({
        name: 'GradeSchoolYear',
        columnNames: ['school_year_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'school_years',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('grades', 'GradeSchoolYear');
    await queryRunner.dropColumn('grades', 'school_year_id');
  }
}
