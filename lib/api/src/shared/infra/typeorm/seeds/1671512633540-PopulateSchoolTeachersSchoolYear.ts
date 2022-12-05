import { MigrationInterface, QueryRunner } from 'typeorm';

type SchoolYear = {
  id: string;
};

type SchoolTeacher = {
  id: string;
};

export default class PopulateSchoolTeachersSchoolYear1671512633540
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [schoolYear]: SchoolYear[] = await queryRunner.query(`
      SELECT id
        FROM school_years
       WHERE status = 'ACTIVE'
    `);
    if (!schoolYear) return;

    const schoolTeachers: SchoolTeacher[] = await queryRunner.query(`
      SELECT id from school_teachers
    `);
    if (!schoolTeachers?.length) return;

    const promises = schoolTeachers.map(schoolTeacher => {
      return queryRunner.query(
        `
        UPDATE school_teachers SET school_year_id=$2 WHERE id=$1
      `,
        [schoolTeacher.id, schoolYear.id],
      );
    });

    await Promise.all(promises);
  }

  public async down(): Promise<void> {
    console.log('rollback is not possible');
  }
}
