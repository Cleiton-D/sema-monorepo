import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateMedicalCertificate1671167456193
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'medical_certificates',
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
            name: 'enroll_id',
            type: 'uuid',
          },
          {
            name: 'date_start',
            type: 'timestamp',
          },
          {
            name: 'date_end',
            type: 'timestamp',
          },
          {
            name: 'description',
            type: 'varchar',
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
            name: 'MedicalCertificateEnroll',
            columnNames: ['enroll_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'enrolls',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('medical_certificates');
  }
}
