import { MigrationInterface, QueryRunner } from 'typeorm';

type SchoolReport = {
  enroll_id: string;
  status: string;
};

export default class FixEnrollStatus1670165113678
  implements MigrationInterface
{
  private getStatus(schoolReportsStatus: string[]): string {
    const statusSet = new Set(schoolReportsStatus);

    if (statusSet.has('DISAPPROVED_FOR_ABSENCES')) {
      return 'DISAPPROVED_FOR_ABSENCES';
    }

    if (statusSet.has('DISAPPROVED')) return 'DISAPPROVED';

    if (schoolReportsStatus.every(status => status === 'APPROVED')) {
      return 'APPROVED';
    }

    return 'ACTIVE';
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

    const groupedSchoolReports = schoolReports.reduce<Record<string, string[]>>(
      (acc, schoolReport) => {
        const { enroll_id, status } = schoolReport;
        const currentItems = acc[enroll_id] || [];

        return { ...acc, [enroll_id]: [...currentItems, status] };
      },
      {},
    );

    const promises = Object.keys(groupedSchoolReports).map(enrollId => {
      const status = this.getStatus(groupedSchoolReports[enrollId] || []);

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
