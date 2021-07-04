import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddDeletedAtColumnToTeacherSchoolSubject1623381153566
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'teacher_school_subjects',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('teacher_school_subjects', 'deleted_at');
  }
}
