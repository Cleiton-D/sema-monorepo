import { MigrationInterface, QueryRunner } from 'typeorm';

type SchoolReport = {
  id: string;
};

export default class FixExamAverages1671628589268
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const school_reports: SchoolReport[] = await queryRunner.query(`
      SELECT id
        FROM school_reports school_report
       WHERE (school_report.status = 'EXAM' OR school_report."status" = 'DISAPPROVED')
         AND school_report.exam IS NOT NULL
         AND school_report.exam >= 500
    `);

    if (!school_reports?.length) return;

    const promises = school_reports.map(({ id }) => {
      return queryRunner.query(
        `
        UPDATE school_reports SET status='APPROVED' WHERE id=$1
      `,
        [id],
      );
    });

    await Promise.all(promises);
  }

  public async down(): Promise<void> {
    console.log('rollback is not possible');
  }
}
