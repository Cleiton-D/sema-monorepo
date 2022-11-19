import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddTransferDateToEnroll1662229254998
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'enrolls',
      new TableColumn({
        name: 'transfer_date',
        type: 'date',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('enrolls', 'transfer_date');
  }
}
