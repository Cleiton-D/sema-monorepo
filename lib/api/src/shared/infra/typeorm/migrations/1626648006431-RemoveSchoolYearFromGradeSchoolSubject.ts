import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class RemoveSchoolYearFromGradeSchoolSubject1626648006431
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'grade_school_subjects',
      'GradeSchoolSubjectsSchoolYears',
    );
    await queryRunner.dropColumn('grade_school_subjects', 'school_year_id');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'grade_school_subjects',
      new TableColumn({
        name: 'school_year_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'grade_school_subjects',
      new TableForeignKey({
        name: 'GradeSchoolSubjectsSchoolYears',
        columnNames: ['school_year_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'school_years',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }
}
