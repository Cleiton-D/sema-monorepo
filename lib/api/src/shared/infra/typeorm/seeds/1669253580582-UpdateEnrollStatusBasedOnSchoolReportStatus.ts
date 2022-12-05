import { MigrationInterface, QueryRunner } from 'typeorm';

type SchoolReport = {
  enroll_id: string;
  status: string;
};

export default class UpdateEnrollStatusBasedOnSchoolReportStatus1669253580582
  implements MigrationInterface
{
  private getStatus(newStatus: string, current?: string): string {
    if (!current) return newStatus;

    const activeStatus = ['ACTIVE', 'APPROVED'];

    if (!activeStatus.includes(current)) return current;
    if (!activeStatus.includes(newStatus)) return newStatus;
    if (current === newStatus) return current;

    return current;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const schoolReports: SchoolReport[] = await queryRunner.query(`
      SELECT school_report.enroll_id AS enroll_id,
             school_report.status AS status
        FROM school_reports school_report
  INNER JOIN enrolls enroll ON enroll.id = school_report.enroll_id
       WHERE enroll.status NOT IN('TRANSFERRED', 'QUITTER', 'DECEASED', 'INACTIVE')
    `);
    if (!schoolReports?.length) return;

    const groupedSchoolReports = schoolReports.reduce<Record<string, string>>(
      (acc, schoolReport) => {
        const { enroll_id, status } = schoolReport;
        const currentStatus = acc[enroll_id];
        const newStatus = this.getStatus(status, currentStatus);

        return { ...acc, [enroll_id]: newStatus };
      },
      {},
    );

    const promises = Object.keys(groupedSchoolReports).map(enrollId => {
      const status = groupedSchoolReports[enrollId];

      return queryRunner.query(
        `
        UPDATE enrolls SET status=$2 WHERE id=$1
      `,
        [enrollId, status],
      );
    });

    await Promise.all(promises);
  }

  public async down(): Promise<void> {
    console.log('rollback is not possible');
  }
}
