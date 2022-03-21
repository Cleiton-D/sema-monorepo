import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddEnrollDate1647797627301 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'enrolls',
      new TableColumn({
        name: 'enroll_date',
        type: 'timestamp',
        default: 'now()',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('enrolls', 'enroll_date');
  }
}
