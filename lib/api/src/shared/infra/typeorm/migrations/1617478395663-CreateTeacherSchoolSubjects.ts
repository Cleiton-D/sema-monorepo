import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTeacherSchoolSubjects1617478395663
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'teacher_school_subjects',
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
            name: 'teacher_id',
            type: 'uuid',
          },
          {
            name: 'school_subject_id',
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
            name: 'TeacherSchoolSubjectTeacher',
            columnNames: ['teacher_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'teachers',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'TeacherSchoolSubjectSchoolSubject',
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
      queryRunner.dropForeignKey(
        'teacher_school_subjects',
        'TeacherSchoolSubjectTeacher',
      ),
      queryRunner.dropForeignKey(
        'teacher_school_subjects',
        'TeacherSchoolSubjectSchoolSubject',
      ),
    ]);

    await queryRunner.dropTable('teacher_school_subjects');
  }
}
