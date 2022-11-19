import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreatePersonDocuments1614904509027
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'person_documents',
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
            name: 'document_number',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'document_type',
            type: 'enum',
            enum: ['RG', 'CPF', 'CNH'],
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
            name: 'PersonPersonDocuments',
            columnNames: ['person_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'persons',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'person_documents',
      'PersonPersonDocuments',
    );
    await queryRunner.dropTable('person_documents');
  }
}
