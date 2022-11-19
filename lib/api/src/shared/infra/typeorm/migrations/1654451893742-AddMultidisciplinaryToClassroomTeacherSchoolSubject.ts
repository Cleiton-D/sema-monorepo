import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddMultidisciplinaryToClassroomTeacherSchoolSubject1654451893742
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'classroom_teacher_school_subjects',
      new TableColumn({
        name: 'is_multidisciplinary',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'classroom_teacher_school_subjects',
      'is_multidisciplinary',
    );
  }
}
