import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateStudentContact1636212154749
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'student_contacts',
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
            name: 'student_id',
            type: 'uuid',
          },
          {
            name: 'contact_id',
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
        ],
        foreignKeys: [
          {
            name: 'StudentStudentContacts',
            columnNames: ['student_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'students',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'StudentContactsContact',
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
    await queryRunner.dropTable('student_contacts');
  }
}
