import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class ReplaceEnrollPersonToStudent1636206846194
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'enrolls',
      new TableColumn({
        name: 'student_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'enrolls',
      new TableForeignKey({
        name: 'enrollStudent',
        columnNames: ['student_id'],
        referencedTableName: 'students',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.query(
      `ALTER TABLE enrolls ALTER COLUMN person_id DROP NOT NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('students', 'enrollStudent');
    await queryRunner.dropColumn('students', 'student_id');

    await queryRunner.query(
      `ALTER TABLE enrolls ALTER COLUMN person_id SET NOT NULL;`,
    );
  }
}
