import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTimetables1618091032654
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'timetables',
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
            name: 'classroom_id',
            type: 'uuid',
          },
          {
            name: 'school_subject_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'day_of_week',
            type: 'enum',
            enum: [
              'SUNDAY',
              'MONDAY',
              'TUESDAY',
              'WEDNESDAY',
              'THURSDAY',
              'FRIDAY',
              'SATURDAY',
            ],
          },
          {
            name: 'time_start',
            type: 'time',
          },
          {
            name: 'time_end',
            type: 'time',
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
            name: 'TimetableClassroom',
            columnNames: ['classroom_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'classrooms',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'TimetableSchoolSubject',
            columnNames: ['school_subject_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'school_subjects',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.dropForeignKey('timetables', 'TimetableClassroom'),
      queryRunner.dropForeignKey('timetables', 'TimetableSchoolSubject'),
    ]);

    await queryRunner.dropTable('timetables');
  }
}
