import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class RemoveTeacherFromTeacherSchoolSubject1623376109522
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'teacher_school_subjects',
      new TableColumn({
        name: 'employee_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'teacher_school_subjects',
      new TableForeignKey({
        name: 'TeacherSchoolSubjectEmployee',
        columnNames: ['employee_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employees',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.dropForeignKey(
      'teacher_school_subjects',
      'TeacherSchoolSubjectTeacher',
    );
    await queryRunner.dropColumn('teacher_school_subjects', 'teacher_id');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'teacher_school_subjects',
      new TableColumn({
        name: 'teacher_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'teacher_school_subjects',
      new TableForeignKey({
        name: 'TeacherSchoolSubjectTeacher',
        columnNames: ['teacher_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'teachers',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.dropForeignKey(
      'teacher_school_subjects',
      'TeacherSchoolSubjectEmployee',
    );
    await queryRunner.dropColumn('teacher_school_subjects', 'employee_id');
  }
}
