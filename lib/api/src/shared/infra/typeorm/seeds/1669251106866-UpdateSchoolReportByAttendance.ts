import { MigrationInterface, QueryRunner } from 'typeorm';

type SchoolReport = {
  id: string;
  enroll_id: string;
  school_subject_id: string;
  status: string;
};

type MultidisciplinarySchoolSubject = {
  multidisciplinary_id: string;
};

type Absences = {
  absences: number;
};

type MaxAbsences = {
  maxAbsences: number;
};

export default class UpdateSchoolReportByAttendance1669251106866
  implements MigrationInterface
{
  private async createNewSchoolReport(
    queryRunner: QueryRunner,
    schoolReport: SchoolReport,
  ) {
    const [multidisciplinary]: MultidisciplinarySchoolSubject[] =
      await queryRunner.query(
        `SELECT ss.id AS multidisciplinary_id
           FROM grades g
     INNER JOIN enrolls e ON e.grade_id = g.id
     INNER JOIN grade_school_subjects gss ON gss.grade_id = g.id
     INNER JOIN school_subjects ss ON ss.id = gss.school_subject_id
          WHERE ss.is_multidisciplinary = TRUE
            AND gss.deleted_at IS NULL
            AND g.deleted_at IS NULL
            AND e.id = $1
    `,
        [schoolReport.enroll_id],
      );

    const schoolSubject =
      multidisciplinary?.multidisciplinary_id || schoolReport.school_subject_id;

    const [maxAbsences]: MaxAbsences[] = await queryRunner.query(
      `
      SELECT (gss.workload * 0.25) AS maxAbsences
        FROM grade_school_subjects gss
  INNER JOIN enrolls e ON e.grade_id = gss.grade_id
       WHERE gss.school_subject_id = $1
         AND e.id = $2
    `,
      [schoolSubject, schoolReport.enroll_id],
    );

    const [totalAbsences]: Absences[] = await queryRunner.query(
      `
      SELECT COUNT(1) AS absences
        FROM attendances a
  INNER JOIN classes c ON c.id = a.class_id
       WHERE a.attendance = false
         AND a.enroll_id = $1
         AND c.school_subject_id = $2
    `,
      [schoolReport.enroll_id, schoolSubject],
    );

    if (totalAbsences.absences >= maxAbsences.maxAbsences) {
      await queryRunner.query(
        `
        UPDATE school_reports SET status='DISAPPROVED_FOR_ABSENCES' WHERE id=$1
      `,
        [schoolReport.id],
      );
    }
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const schoolReports: SchoolReport[] = await queryRunner.query(`
      SELECT school_report.id as id,
             enroll_id,
             school_subject_id,
             status
        FROM school_reports school_report
    `);
    if (!schoolReports?.length) return;

    const promises = schoolReports.map(schoolReport => {
      return this.createNewSchoolReport(queryRunner, schoolReport);
    });
    await Promise.all(promises);
  }

  public async down(): Promise<void> {
    console.log('rollback is not possible');
  }
}
