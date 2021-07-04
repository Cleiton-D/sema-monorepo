import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSchoolContacts1616096253374
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'school_contacts',
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
            name: 'school_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'contact_id',
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
            name: 'SchoolIdOfSchool',
            columnNames: ['school_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'schools',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'SchoolContactIdOfContact',
            columnNames: ['contact_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'contacts',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('school_contacts', 'SchoolIdOfSchool');
    await queryRunner.dropForeignKey(
      'school_contacts',
      'SchoolContactIdOfContact',
    );

    await queryRunner.dropTable('school_contacts');
  }
}
