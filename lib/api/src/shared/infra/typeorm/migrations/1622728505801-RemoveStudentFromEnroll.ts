import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class RemoveStudentFromEnroll1622728505801
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('enrolls', 'EnrollStudent');
    await queryRunner.dropColumn('enrolls', 'student_id');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'enrolls',
      new TableColumn({
        name: 'student_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'enrolls',
      new TableForeignKey({
        name: 'EnrollStudent',
        columnNames: ['student_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'students',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }
}
