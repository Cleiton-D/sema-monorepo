import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddClassDateToClass1635614968245
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.addColumn(
    //   'classes',
    //   new TableColumn({
    //     name: 'class_date',
    //     type: 'timestamp',
    //   }),
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('classes', 'class_date');
  }
}
