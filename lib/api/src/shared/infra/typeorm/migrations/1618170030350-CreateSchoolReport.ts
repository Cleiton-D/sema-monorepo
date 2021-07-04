import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSchoolReport1618170030350
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'school_reports',
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
            name: 'school_subject_id',
            type: 'uuid',
          },
          {
            name: 'average',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'school_term',
            type: 'enum',
            enum: ['FIRST', 'SECOND', 'THIRD', 'FOURTH'],
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
            name: 'SchoolReportsEnrolls',
            columnNames: ['enroll_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'enrolls',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'SchoolReportsSchoolSubjects',
            columnNames: ['school_subject_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'school_subjects',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.dropForeignKey('school_reports', 'SchoolReportsEnrolls'),
      queryRunner.dropForeignKey(
        'school_reports',
        'SchoolReportsSchoolSubjects',
      ),
    ]);

    await queryRunner.dropTable('school_reports');
  }
}
