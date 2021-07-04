import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSchoolTeacher1617477945321
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'school_teachers',
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
            name: 'school_id',
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
            name: 'SchoolTeacherTeacher',
            columnNames: ['teacher_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'teachers',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'SchoolTeacherSchool',
            columnNames: ['school_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'schools',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.dropForeignKey('school_teachers', 'SchoolTeacherTeacher'),
      queryRunner.dropForeignKey('school_teachers', 'SchoolTeacherSchool'),
    ]);

    await queryRunner.dropTable('school_teachers');
  }
}
