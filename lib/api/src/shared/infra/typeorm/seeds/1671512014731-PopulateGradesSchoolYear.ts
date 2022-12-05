import { MigrationInterface, QueryRunner } from 'typeorm';

type SchoolYear = {
  id: string;
};

type Grade = {
  id: string;
};

export default class PopulateGradesSchoolYear1671512014731
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [schoolYear]: SchoolYear[] = await queryRunner.query(`
      SELECT id
        FROM school_years
       WHERE status = 'ACTIVE'
    `);
    if (!schoolYear) return;

    const grades: Grade[] = await queryRunner.query(`
      SELECT id from grades
    `);
    if (!grades?.length) return;

    const promises = grades.map(grade => {
      return queryRunner.query(
        `
        UPDATE grades SET school_year_id=$2 WHERE id=$1
      `,
        [grade.id, schoolYear.id],
      );
    });

    await Promise.all(promises);
  }

  public async down(): Promise<void> {
    console.log('rollback is not possible');
  }
}
