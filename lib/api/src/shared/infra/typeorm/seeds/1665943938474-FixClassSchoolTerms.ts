import { MigrationInterface, QueryRunner } from 'typeorm';
import SchoolTerm from '../enums/SchoolTerm';

type Class = {
  id: string;
  class_date: string;
  current_school_term: SchoolTerm;
  correct_school_term: SchoolTerm;
};

export default class FixClassSchoolTerms1665943938474
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const classes: Class[] = await queryRunner.query(`
      SELECT *
        FROM (SELECT c.id,
                     c.class_date,
                     c.school_term as current_school_term,
                     stp.school_term as correct_school_term
                FROM classes c,
                     school_term_periods stp
               WHERE stp.date_start::DATE <= c.class_date::DATE
                 AND stp.date_end::DATE >= c.class_date::DATE
              ) AS a
       WHERE a.current_school_term::VARCHAR <> a.correct_school_term::VARCHAR
    `);

    if (!classes?.length) return;

    const promises = classes.map(({ id, correct_school_term }) => {
      return queryRunner.query(
        `UPDATE classes SET school_term = $2 WHERE id = $1`,
        [id, correct_school_term],
      );
    });

    await Promise.all(promises);
  }

  public async down(): Promise<void> {
    console.log('revert is not possible');
  }
}
