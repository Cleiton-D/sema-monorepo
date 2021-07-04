import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class ChangeClassroom1618085795976
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('classrooms', 'period');
    await queryRunner.addColumn(
      'classrooms',
      new TableColumn({
        name: 'class_period_id',
        type: 'uuid',
      }),
    );
    await queryRunner.createForeignKey(
      'classrooms',
      new TableForeignKey({
        name: 'ClassRoomClassPeriod',
        columnNames: ['class_period_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'class_periods',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('classrooms', 'ClassRoomClassPeriod');
    await queryRunner.dropColumn('classrooms', 'class_period_id');
    await queryRunner.addColumn(
      'classrooms',
      new TableColumn({
        name: 'period',
        type: 'enum',
        enum: ['MORNING', 'EVENING', 'NOCTURNAL'],
      }),
    );
  }
}
