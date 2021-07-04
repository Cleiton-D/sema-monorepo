import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddSchoolToTeacherSchoolSubject1623375882723
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'teacher_school_subjects',
      new TableColumn({
        name: 'school_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'teacher_school_subjects',
      new TableForeignKey({
        name: 'TeacherSchoolSubjecSchool',
        columnNames: ['school_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'schools',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'teacher_school_subjects',
      'TeacherSchoolSubjecSchool',
    );

    await queryRunner.dropColumn('teacher_school_subjects', 'school_id');
  }
}
