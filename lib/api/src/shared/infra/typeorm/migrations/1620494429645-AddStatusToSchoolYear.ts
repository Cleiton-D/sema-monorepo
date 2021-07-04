import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddStatusToSchoolYear1620494429645
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'school_years',
      new TableColumn({
        name: 'status',
        type: 'Status',
        default: "'PENDING'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('school_years', 'status');
  }
}
