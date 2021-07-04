import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateClassRooms1617229400742
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'classrooms',
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
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'period',
            type: 'enum',
            enum: ['MORNING', 'EVENING', 'NOCTURNAL'],
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
            name: 'ClassRoomSchool',
            columnNames: ['school_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'schools',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'ClassRoomGrade',
            columnNames: ['grade_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'grades',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'ClassroomSchoolYear',
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
      queryRunner.dropForeignKey('classrooms', 'ClassRoomSchool'),
      queryRunner.dropForeignKey('classrooms', 'ClassRoomGrade'),
    ]);

    await queryRunner.dropTable('classrooms');
  }
}
