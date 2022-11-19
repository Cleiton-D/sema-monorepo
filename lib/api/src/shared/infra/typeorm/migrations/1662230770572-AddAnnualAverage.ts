import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddAnnualAverage1662230770572
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'school_reports',
      new TableColumn({
        name: 'annual_average',
        type: 'integer',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('school_reports', 'annual_average');
  }
}
