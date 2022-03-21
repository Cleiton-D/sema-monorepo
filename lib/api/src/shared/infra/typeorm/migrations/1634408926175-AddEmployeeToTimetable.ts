import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddEmployeeToTimetable1634408926175
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'timetables',
      new TableColumn({
        name: 'employee_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'timetables',
      new TableForeignKey({
        name: 'TimetableEmployee',
        columnNames: ['employee_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employees',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('timetables', 'TimetableEmployee');
    await queryRunner.dropColumn('timetables', 'employee_id');
  }
}
