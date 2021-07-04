import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddRemovedAtColumnToGradeSchoolSubject1622250294014
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'grade_school_subjects',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('grade_school_subjects', 'deleted_at');
  }
}
