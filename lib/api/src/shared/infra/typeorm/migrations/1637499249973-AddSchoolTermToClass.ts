import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddSchoolTermToClass1637499249973
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'classes',
      new TableColumn({
        name: 'school_term',
        type: 'enum',
        enum: [
          'FIRST',
          'SECOND',
          'THIRD',
          'FOURTH',
          'FIRST-REC',
          'SECOND-REC',
          'EXAM',
        ],
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('classes', 'school_term');
  }
}
