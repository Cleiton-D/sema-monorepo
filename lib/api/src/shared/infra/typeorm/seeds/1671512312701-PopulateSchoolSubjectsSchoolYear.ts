import { MigrationInterface, QueryRunner } from 'typeorm';

type SchoolYear = {
  id: string;
};

type SchoolSubject = {
  id: string;
};

export default class PopulateSchoolSubjectsSchoolYear1671512312701
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [schoolYear]: SchoolYear[] = await queryRunner.query(`
      SELECT id
        FROM school_years
       WHERE status = 'ACTIVE'
    `);
    if (!schoolYear) return;

    const schoolSubjects: SchoolSubject[] = await queryRunner.query(`
      SELECT id from school_subjects
    `);
    if (!schoolSubjects?.length) return;

    const promises = schoolSubjects.map(schoolSubject => {
      return queryRunner.query(
        `
        UPDATE school_subjects SET school_year_id=$2 WHERE id=$1
      `,
        [schoolSubject.id, schoolYear.id],
      );
    });

    await Promise.all(promises);
  }

  public async down(): Promise<void> {
    console.log('rollback is not possible');
  }
}
