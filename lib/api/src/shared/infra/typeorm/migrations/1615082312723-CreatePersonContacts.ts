import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreatePersonContacts1615082312723
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'person_contacts',
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
            name: 'person_id',
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
            name: 'PersonPersonContacts',
            columnNames: ['person_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'persons',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'PersonContactsContacts',
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
    await queryRunner.dropForeignKey('person_contacts', 'PersonPersonContacts');
    await queryRunner.dropForeignKey(
      'person_contacts',
      'PersonContactsContacts',
    );

    await queryRunner.dropTable('person_contacts');
  }
}
