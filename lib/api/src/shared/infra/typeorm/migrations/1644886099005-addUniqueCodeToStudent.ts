import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class addUniqueCodeToStudent1644886099005
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'students',
      new TableColumn({
        name: 'unique_code',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('students', 'unique_code');
  }
}
