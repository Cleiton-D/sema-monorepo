import { MigrationInterface, QueryRunner } from 'typeorm';

type SchoolYear = {
  id: string;
};

type ClassPeriod = {
  id: string;
};

export default class PopulateClassPeriodsSchoolYear1671513146805
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [schoolYear]: SchoolYear[] = await queryRunner.query(`
      SELECT id
        FROM school_years
       WHERE status = 'ACTIVE'
    `);
    if (!schoolYear) return;

    const classPeriods: ClassPeriod[] = await queryRunner.query(`
      SELECT id from class_periods
    `);
    if (!classPeriods?.length) return;

    const promises = classPeriods.map(classPeriod => {
      return queryRunner.query(
        `
        UPDATE class_periods SET school_year_id=$2 WHERE id=$1
      `,
        [classPeriod.id, schoolYear.id],
      );
    });

    await Promise.all(promises);
  }

  public async down(): Promise<void> {
    console.log('rollback is not possible');
  }
}
