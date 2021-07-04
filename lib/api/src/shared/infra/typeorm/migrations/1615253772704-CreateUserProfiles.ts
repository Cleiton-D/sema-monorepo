import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateUserProfiles1615253772704
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_profiles',
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
            name: 'description',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'branch_id',
            type: 'uuid',
          },
          {
            name: 'access_level_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'default_profile',
            type: 'boolean',
            isNullable: false,
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
            name: 'UserProfileUser',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'UserProfileBranch',
            columnNames: ['branch_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'branchs',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'UserProfileAccessLevel',
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
      queryRunner.dropForeignKey('user_profiles', 'UserProfileUser'),
      queryRunner.dropForeignKey('user_profiles', 'UserProfileBranch'),
      queryRunner.dropForeignKey('user_profiles', 'UserProfileAccessLevel'),
    ]);

    await queryRunner.dropTable('user_profiles');
  }
}
