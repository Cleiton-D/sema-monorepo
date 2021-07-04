import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateGradeSchoolSubjects1617478606899
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'grade_school_subjects',
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
            name: 'school_subject_id',
            type: 'uuid',
          },
          {
            name: 'grade_id',
            type: 'uuid',
          },
          {
            name: 'school_year_id',
            type: 'uuid',
          },
          {
            name: 'workload',
            type: 'integer',
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
            name: 'GradeSchoolSubjectsGrade',
            columnNames: ['grade_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'grades',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'GradeSchoolSubjectsSchoolSubject',
            columnNames: ['school_subject_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'school_subjects',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'GradeSchoolSubjectsSchoolYears',
            columnNames: ['school_year_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'school_years',
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
        'grade_school_subjects',
        'GradeSchoolSubjectsGrade',
      ),
      queryRunner.dropForeignKey(
        'grade_school_subjects',
        'GradeSchoolSubjectsSchoolSubject',
      ),
    ]);

    await queryRunner.dropTable('grade_school_subjects');
  }
}
