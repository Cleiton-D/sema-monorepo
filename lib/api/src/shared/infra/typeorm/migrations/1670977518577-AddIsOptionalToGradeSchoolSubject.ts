import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddIsOptionalToGradeSchoolSubject1670977518577
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'grade_school_subjects',
      new TableColumn({
        name: 'is_required',
        type: 'boolean',
        default: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('grade_school_subjects', 'is_required');
  }
}
