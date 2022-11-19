import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddManualChangeToSchoolTermPeriod1652014473340
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'school_term_periods',
      new TableColumn({
        name: 'manually_changed',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('school_term_periods', 'manually_changed');
  }
}
