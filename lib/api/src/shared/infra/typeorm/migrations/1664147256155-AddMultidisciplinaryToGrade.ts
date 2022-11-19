import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddMultidisciplinaryToGrade1664147256155
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'grades',
      new TableColumn({
        name: 'is_multidisciplinary',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('grades', 'is_multidisciplinary');
  }
}
