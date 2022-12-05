import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddSchoolYearToSchoolSubjects1671512239881
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'school_subjects',
      new TableColumn({
        name: 'school_year_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'school_subjects',
      new TableForeignKey({
        name: 'SchoolSubjectSchoolYear',
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
      'school_subjects',
      'SchoolSubjectSchoolYear',
    );
    await queryRunner.dropColumn('school_subjects', 'school_year_id');
  }
}
