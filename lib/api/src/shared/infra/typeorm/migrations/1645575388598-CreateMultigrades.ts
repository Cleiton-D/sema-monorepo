import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateMultigrades1645575388598
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'multigrades_classrooms',
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
            name: 'owner_id',
            type: 'uuid',
          },
          {
            name: 'classroom_id',
            type: 'uuid',
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
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'MultigradesOwners',
            columnNames: ['owner_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'classrooms',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'MultigradesClassrooms',
            columnNames: ['classroom_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'classrooms',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('multigrades_classrooms');
  }
}
