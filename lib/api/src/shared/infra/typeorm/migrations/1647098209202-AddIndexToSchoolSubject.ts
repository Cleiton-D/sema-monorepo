import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddIndexToSchoolSubject1647098209202
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'school_subjects',
      new TableColumn({
        name: 'index',
        type: 'integer',
        default: 99,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('school_subjects', 'index');
  }
}
