import { MigrationInterface, QueryRunner } from 'typeorm';

type SchoolReport = {
  id: string;
  final_average: number;
};

export default class UpdateEnrollStatusBasedOnSchoolReports1669241397821
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const schoolReports: SchoolReport[] = await queryRunner.query(`
      SELECT school_report.id as id,
             final_average
        FROM school_reports school_report
       WHERE school_report.first IS NOT NULL
         AND school_report.second IS NOT NULL
         AND school_report.third IS NOT NULL
         AND school_report.fourth IS NOT NULL
         AND school_report.first_rec IS NULL
         AND school_report.second_rec IS NULL
         AND school_report.exam IS NULL
         AND school_report.status = 'ACTIVE'
    `);

    if (!schoolReports?.length) return;

    const promises = schoolReports.map(schoolReport => {
      const result =
        schoolReport.final_average >= 600 ? 'APPROVED' : 'RECOVERY';

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
