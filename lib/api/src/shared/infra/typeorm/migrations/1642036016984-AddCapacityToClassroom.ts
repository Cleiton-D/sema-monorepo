import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddCapacityToClassroom1642036016984
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'classrooms',
      new TableColumn({
        name: 'capacity',
        type: 'integer',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('classrooms', 'capacity');
  }
}
