import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class addMultiseriateToClassroom1645575220578
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'classrooms',
      new TableColumn({
        name: 'is_multigrade',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('classrooms', 'is_multigrade');
  }
}
