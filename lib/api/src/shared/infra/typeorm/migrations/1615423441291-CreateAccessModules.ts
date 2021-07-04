import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAccessModules1615423441291
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'access_modules',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'access_level_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'app_module_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'read',
            type: 'boolean',
            default: false,
          },
          {
            name: 'write',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'AccessModuleAppModule',
            columnNames: ['app_module_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'app_modules',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'AccessModuleAccessLevel',
            columnNames: ['access_level_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'access_levels',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.dropForeignKey('access_modules', 'AccessModuleAppModule'),
      queryRunner.dropForeignKey('access_modules', 'AccessModuleAccessLevel'),
    ]);
    await queryRunner.dropTable('access_modules');
  }
}
