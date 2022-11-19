import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddEnrollClassroomToAttendance1653153234288
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'attendances',
      new TableColumn({
        name: 'enroll_classroom_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'attendances',
      new TableForeignKey({
        name: 'AttendanceEnrollClassroom',
        columnNames: ['enroll_classroom_id'],
        referencedTableName: 'enroll_classrooms',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'attendances',
      'AttendanceEnrollClassroom',
    );
    await queryRunner.dropColumn('attendances', 'enroll_classroom_id');
  }
}
