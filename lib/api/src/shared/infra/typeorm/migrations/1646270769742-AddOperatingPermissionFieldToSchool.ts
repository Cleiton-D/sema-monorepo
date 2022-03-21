import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddOperatingPermissionFieldToSchool1646270769742
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('schools', [
      new TableColumn({
        name: 'creation_decree',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'recognition_opinion',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'authorization_ordinance',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('schools', 'creation_decree');
    await queryRunner.dropColumn('schools', 'recognition_opinion');
    await queryRunner.dropColumn('schools', 'authorization_ordinance');
  }
}
