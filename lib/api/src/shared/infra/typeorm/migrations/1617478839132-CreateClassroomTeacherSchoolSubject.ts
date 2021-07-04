import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateClassroomTeacherSchoolSubject1617478839132
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'classroom_teacher_school_subjects',
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
            name: 'teacher_school_subject_id',
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
            name: 'ClassroomTeacherSchoolSubjectsClassroom',
            columnNames: ['classroom_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'classrooms',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'ClassroomTeacherSchoolSubjectsTeacherSchoolSubject',
            columnNames: ['teacher_school_subject_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'teacher_school_subjects',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.dropForeignKey(
        'classroom_teacher_school_subjects',
        'ClassroomTeacherSchoolSubjectsClassroom',
      ),
      queryRunner.dropForeignKey(
        'classroom_teacher_school_subjects',
        'ClassroomTeacherSchoolSubjectsTeacherSchoolSubject',
      ),
    ]);

    await queryRunner.dropTable('classroom_teacher_school_subjects');
  }
}
