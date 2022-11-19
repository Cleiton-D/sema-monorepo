import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class RemoveMultidisciplinaryFromClassroom1665273078545
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('classrooms', 'is_multidisciplinary');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'classrooms',
      new TableColumn({
        name: 'is_multidisciplinary',
        type: 'boolean',
        default: false,
      }),
    );
  }
}
