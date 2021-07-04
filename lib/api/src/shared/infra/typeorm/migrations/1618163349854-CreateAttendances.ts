import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAttendances1618163349854
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'attendances',
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
            name: 'class_id',
            type: 'uuid',
          },
          {
            name: 'attendance',
            type: 'boolean',
          },
          {
            name: 'justified',
            type: 'boolean',
            default: false,
          },
          {
            name: 'justification_description',
            type: 'varchar',
            isNullable: true,
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
            name: 'AttendancesEnrolls',
            columnNames: ['enroll_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'enrolls',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'AttendancesClasses',
            columnNames: ['class_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'classes',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.dropForeignKey('attendances', 'AttendancesStudents'),
      queryRunner.dropForeignKey('attendances', 'AttendancesClasses'),
    ]);

    await queryRunner.dropTable('attendances');
  }
}
