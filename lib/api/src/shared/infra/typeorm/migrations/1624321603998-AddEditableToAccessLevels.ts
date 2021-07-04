import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddEditableToAccessLevels1624321603998
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'access_levels',
      new TableColumn({
        name: 'editable',
        type: 'boolean',
        isNullable: true,
      }),
    );

    await queryRunner.query(`update access_levels set editable=false`);
    await queryRunner.changeColumn(
      'access_levels',
      'editable',
      new TableColumn({
        name: 'editable',
        type: 'boolean',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('access_levels', 'editable');
  }
}
