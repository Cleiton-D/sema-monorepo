import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddDeletedAtColumnToClassroomTeacherSchoolSubject1623547166040
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'classroom_teacher_school_subjects',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'classroom_teacher_school_subjects',
      'deleted_at',
    );
  }
}
