import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class RefactorClassroomTeacherSchoolSubjectTable1623549710465
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.addColumn(
        'classroom_teacher_school_subjects',
        new TableColumn({
          name: 'employee_id',
          type: 'uuid',
        }),
      ),
      queryRunner.addColumn(
        'classroom_teacher_school_subjects',
        new TableColumn({
          name: 'school_subject_id',
          type: 'uuid',
        }),
      ),
    ]);

    await Promise.all([
      queryRunner.createForeignKey(
        'classroom_teacher_school_subjects',
        new TableForeignKey({
          name: 'ClassroomTeacherSchoolSubjectEmployee',
          columnNames: ['employee_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'employees',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      ),
      queryRunner.createForeignKey(
        'classroom_teacher_school_subjects',
        new TableForeignKey({
          name: 'ClassroomTeacherSchoolSubjectSchoolSubject',
          columnNames: ['school_subject_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'school_subjects',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      ),
    ]);

    await queryRunner.dropForeignKey(
      'classroom_teacher_school_subjects',
      'ClassroomTeacherSchoolSubjectsTeacherSchoolSubject',
    );
    await queryRunner.dropColumn(
      'classroom_teacher_school_subjects',
      'teacher_school_subject_id',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'classroom_teacher_school_subjects',
      new TableColumn({
        name: 'teacher_school_subject_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'classroom_teacher_school_subjects',
      new TableForeignKey({
        name: 'ClassroomTeacherSchoolSubjectsTeacherSchoolSubject',
        columnNames: ['teacher_school_subject_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'teacher_school_subjects',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await Promise.all([
      queryRunner.dropForeignKey(
        'classroom_teacher_school_subjects',
        'ClassroomTeacherSchoolSubjectEmployee',
      ),
      queryRunner.dropForeignKey(
        'classroom_teacher_school_subjects',
        'ClassroomTeacherSchoolSubjectSchoolSubject',
      ),
    ]);

    await Promise.all([
      queryRunner.dropColumn(
        'classroom_teacher_school_subjects',
        'employee_id',
      ),
      queryRunner.dropColumn(
        'classroom_teacher_school_subjects',
        'school_subject_id',
      ),
    ]);
  }
}
