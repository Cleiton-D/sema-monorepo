import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class RefactorClassesTable1623608381212
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.dropForeignKey('classes', 'ClassTimetable'),
      queryRunner.dropForeignKey('classes', 'ClassTeacher'),
    ]);
    await Promise.all([
      queryRunner.dropColumn('classes', 'timetable_id'),
      queryRunner.dropColumn('classes', 'teacher_id'),
    ]);

    await Promise.all([
      queryRunner.addColumn(
        'classes',
        new TableColumn({
          name: 'employee_id',
          type: 'uuid',
        }),
      ),
      queryRunner.addColumn(
        'classes',
        new TableColumn({
          name: 'school_subject_id',
          type: 'uuid',
        }),
      ),
      queryRunner.addColumn(
        'classes',
        new TableColumn({
          name: 'classroom_id',
          type: 'uuid',
        }),
      ),
      queryRunner.addColumn(
        'classes',
        new TableColumn({
          name: 'class_date',
          type: 'timestamp',
        }),
      ),
      queryRunner.addColumn(
        'classes',
        new TableColumn({
          name: 'time_start',
          type: 'time',
        }),
      ),
      queryRunner.addColumn(
        'classes',
        new TableColumn({
          name: 'time_end',
          type: 'time',
          isNullable: true,
        }),
      ),
    ]);

    await Promise.all([
      queryRunner.createForeignKey(
        'classes',
        new TableForeignKey({
          name: 'ClassEmployee',
          columnNames: ['employee_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'employees',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      ),
      queryRunner.createForeignKey(
        'classes',
        new TableForeignKey({
          name: 'ClassSchoolSubject',
          columnNames: ['school_subject_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'school_subjects',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      ),
      queryRunner.createForeignKey(
        'classes',
        new TableForeignKey({
          name: 'ClassClassroom',
          columnNames: ['classroom_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'classrooms',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.dropForeignKey('classes', 'ClassEmployee'),
      queryRunner.dropForeignKey('classes', 'ClassSchoolSubject'),
      queryRunner.dropForeignKey('classes', 'ClassClassroom'),
    ]);

    await Promise.all([
      queryRunner.dropColumn('classes', 'employee_id'),
      queryRunner.dropColumn('classes', 'school_subject_id'),
      queryRunner.dropColumn('classes', 'classroom_id'),
      queryRunner.dropColumn('classes', 'class_date'),
      queryRunner.dropColumn('classes', 'time_start'),
      queryRunner.dropColumn('classes', 'time_end'),
    ]);

    await Promise.all([
      queryRunner.addColumn(
        'classes',
        new TableColumn({
          name: 'timetable_id',
          type: 'uuid',
        }),
      ),
      queryRunner.addColumn(
        'classes',
        new TableColumn({
          name: 'teacher_id',
          type: 'uuid',
        }),
      ),
    ]);

    await Promise.all([
      queryRunner.createForeignKey(
        'classes',
        new TableForeignKey({
          name: 'ClassTimetable',
          columnNames: ['timetable_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'timetables',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      ),
      queryRunner.createForeignKey(
        'classes',
        new TableForeignKey({
          name: 'ClassTeacher',
          columnNames: ['teacher_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'teachers',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      ),
    ]);
  }
}
