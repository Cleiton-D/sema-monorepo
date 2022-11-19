import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class RemoveMultidisciplinaryFromGrade1665267823563
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('grades', 'is_multidisciplinary');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'grades',
      new TableColumn({
        name: 'is_multidisciplinary',
        type: 'boolean',
        default: false,
      }),
    );
  }
}
