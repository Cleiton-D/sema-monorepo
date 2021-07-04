import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateEnrollClassrooms1617230721588
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'enroll_classrooms',
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
            type: 'varchar',
          },
          {
            name: 'classroom_id',
            type: 'uuid',
          },
          {
            name: 'enroll_id',
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
            name: 'EnrollClassroomClass',
            columnNames: ['classroom_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'classrooms',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'EnrollClassroomEnroll',
            columnNames: ['enroll_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'enrolls',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.dropForeignKey('enroll_classrooms', 'EnrollClassroomClass'),
      queryRunner.dropForeignKey('enroll_classrooms', 'EnrollClassroomEnroll'),
    ]);

    await queryRunner.dropTable('enroll_classrooms');
  }
}
