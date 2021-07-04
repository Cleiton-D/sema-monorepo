import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class RemoveTeacher1623287643815 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('school_teachers', 'SchoolTeacherTeacher');
    await queryRunner.dropColumn('school_teachers', 'teacher_id');

    await queryRunner.addColumn(
      'school_teachers',
      new TableColumn({
        name: 'employee_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'school_teachers',
      new TableForeignKey({
        name: 'SchoolTeacherEmployee',
        columnNames: ['employee_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employees',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'school_teachers',
      'SchoolTeacherEmployee',
    );
    await queryRunner.dropColumn('school_teachers', 'employee_id');

    await queryRunner.addColumn(
      'school_teachers',
      new TableColumn({
        name: 'teacher_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'school_teachers',
      new TableForeignKey({
        name: 'SchoolTeacherTeacher',
        columnNames: ['teacher_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'teachers',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }
}
