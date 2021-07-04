import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateClasses1618098015294 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'classes',
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
            name: 'timetable_id',
            type: 'uuid',
          },
          {
            name: 'teacher_id',
            type: 'uuid',
          },
          {
            name: 'taught_content',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PROGRESS', 'DONE'],
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
            name: 'ClassTimetable',
            columnNames: ['timetable_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'timetables',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'ClassTeacher',
            columnNames: ['teacher_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'teachers',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.dropForeignKey('classes', 'ClassTimetable'),
      queryRunner.dropForeignKey('classes', 'ClassTeacher'),
    ]);

    await queryRunner.dropTable('classes');
  }
}
