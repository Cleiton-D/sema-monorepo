import { MigrationInterface, QueryRunner } from 'typeorm';

type SchoolTerm =
  | 'FIRST'
  | 'SECOND'
  | 'THIRD'
  | 'FOURTH'
  | 'FIRST-REC'
  | 'SECOND-REC'
  | 'EXAM';

type SchoolReport = {
  id: string;
  enroll_id: string;
  school_subject_id: string;
  average?: number;
  school_term: SchoolTerm;
};

const schoolTermMap: Record<SchoolTerm, string> = {
  FIRST: 'first',
  SECOND: 'second',
  THIRD: 'third',
  FOURTH: 'fourth',
  'FIRST-REC': 'first_rec',
  'SECOND-REC': 'second_rec',
  EXAM: 'exam',
};

export default class MigrateSchoolReportsData1641753662966
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const schoolReports: SchoolReport[] = await queryRunner.query(`
      SELECT id,
             enroll_id,
             school_subject_id,
             average,
             school_term
        FROM school_reports
    `);

    if (!schoolReports.length) return;

    const groupedSchoolReports = schoolReports.reduce<Record<string, any>>(
      (acc, item) => {
        const key = `${item.enroll_id}-${item.school_subject_id}`;

        const currentItem = acc[key] || {};
        const newItem = {
          ...currentItem,
          enroll_id: item.enroll_id,
          school_subject_id: item.school_subject_id,
          [schoolTermMap[item.school_term]]: item.average,
        };

        return { ...acc, [key]: newItem };
      },
      {},
    );

    const insertQueryHeader = `
      INSERT INTO "school_reports" (
        "enroll_id",
        "school_subject_id",
        "first",
        "second",
        "third",
        "fourth",
        "first_rec",
        "second_rec",
        "exam"
      )
    `;

    const rows = Object.values(groupedSchoolReports)
      .map(item => {
        const first = item.first || item.first === 0 ? item.first : null;
        const second = item.second || item.second === 0 ? item.second : null;
        const third = item.third || item.third === 0 ? item.third : null;
        const fourth = item.fourth || item.fourth === 0 ? item.fourth : null;
        const first_rec =
          item.first_rec || item.first_rec === 0 ? item.first_rec : null;
        const second_rec =
          item.second_rec || item.second_rec === 0 ? item.second_rec : null;
        const exam = item.exam || item.exam === 0 ? item.exam : null;

        return `('${item.enroll_id}',
        '${item.school_subject_id}',
        ${first},
        ${second},
        ${third},
        ${fourth},
        ${first_rec},
        ${second_rec},
        ${exam})
      `;
      })
      .join(',');

    const finalQuery = `${insertQueryHeader} VALUES ${rows}`;
    await queryRunner.query(finalQuery);

    const deleteIds = schoolReports.map(({ id }) => `'${id}'`).join(',');
    await queryRunner.query(
      `DELETE FROM "school_reports" WHERE "id" IN (${deleteIds})`,
    );
  }

  public async down(): Promise<void> {
    console.log('reverting');
  }
}
