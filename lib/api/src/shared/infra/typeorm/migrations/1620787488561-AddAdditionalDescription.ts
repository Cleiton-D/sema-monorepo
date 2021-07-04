import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddAdditionalDescription1620787488561
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'school_subjects',
      new TableColumn({
        name: 'additional_description',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('school_subjects', 'additional_description');
  }
}
