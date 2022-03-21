import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateEnroll1617229935418 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'enrolls',
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
            name: 'status',
            type: 'enum',
            enum: [
              'ACTIVE',
              'INACTIVE',
              'TRANSFERRED',
              'QUITTER',
              'DECEASED',
              'APPROVED',
              'DISAPPROVED',
            ],
          },
          {
            name: 'student_id',
            type: 'uuid',
          },
          {
            name: 'school_id',
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
            name: 'EnrollStudent',
            columnNames: ['student_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'students',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'EnrollSchool',
            columnNames: ['school_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'schools',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'EnrollGrade',
            columnNames: ['grade_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'grades',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'EnrollSchoolYear',
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
      queryRunner.dropForeignKey('enrolls', 'EnrollStudent'),
      queryRunner.dropForeignKey('enrolls', 'EnrollSchool'),
      queryRunner.dropForeignKey('enrolls', 'EnrollGrade'),
      queryRunner.dropForeignKey('enrolls', 'EnrollSchoolYear'),
    ]);

    await queryRunner.dropTable('enrolls');
  }
}
