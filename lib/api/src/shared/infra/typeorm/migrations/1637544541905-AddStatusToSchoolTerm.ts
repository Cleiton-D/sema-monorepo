import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddStatusToSchoolTerm1637544541905
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'school_term_periods',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['ACTIVE', 'FINISH', 'PENDING'],
        default: "'PENDING'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('school_term_periods', 'status');
  }
}
