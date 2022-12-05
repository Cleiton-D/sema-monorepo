import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddStatusToSchoolReport1669240856471
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'school_reports',
      new TableColumn({
        name: 'status',
        type: 'enum',
        default: "'ACTIVE'",
        enum: [
          'ACTIVE',
          'CLOSED',
          'APPROVED',
          'DISAPPROVED',
          'RECOVERY',
          'EXAM',
          'DISAPPROVED_FOR_ABSENCES',
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('school_reports', 'status');
  }
}
