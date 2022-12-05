import { MigrationInterface, QueryRunner } from 'typeorm';

type SchoolReport = {
  id: string;
  final_average: number;
};

export default class UpdateEnrollExamStatusBasedOnSchoolReports1669241532829
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const schoolReports: SchoolReport[] = await queryRunner.query(`
      SELECT school_report.id as id,
             final_average
        FROM school_reports school_report
       WHERE school_report.exam IS NOT NULL
         AND school_report.status = 'EXAM'
    `);

    if (!schoolReports?.length) return;

    const promises = schoolReports.map(schoolReport => {
      const result =
        schoolReport.final_average >= 600 ? 'APPROVED' : 'DISAPPROVED';

      return queryRunner.query(
        `
        UPDATE school_reports SET status=$1 WHERE id = $2
      `,
        [result, schoolReport.id],
      );
    });

    await Promise.all(promises);
  }

  public async down(): Promise<void> {
    console.log('rollback is not possible');
  }
}
