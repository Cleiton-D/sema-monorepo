import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSchool1615935674966 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'schools',
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
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'inep_code',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'address_id',
            type: 'uuid',
            isNullable: false,
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
            name: 'AddressesSchool',
            columnNames: ['address_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'adresses',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('schools', 'AddressesSchool');
    // await queryRunner.dropForeignKey('schools', 'BranchSchool');

    await queryRunner.dropTable('schools');
  }
}
