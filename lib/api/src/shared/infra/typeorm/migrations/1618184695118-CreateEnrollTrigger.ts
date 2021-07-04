import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateEnrollTrigger1618184695118
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      CREATE OR REPLACE FUNCTION create_enroll_school_reports_func()
        RETURNS trigger AS $create_enroll_school_reports_trigger$
        DECLARE
          school_subjects uuid[];
          school_subject uuid;
        BEGIN
          school_subjects := ARRAY(SELECT school_subject_id FROM grade_school_subjects WHERE grade_id = NEW.grade_id AND school_year_id = NEW.school_year_id);

          IF array_length(school_subjects, 1) > 0 THEN
            FOREACH school_subject IN ARRAY school_subjects
            LOOP
              INSERT INTO school_reports (enroll_id, school_subject_id, school_term) VALUES (NEW.id, school_subject, 'FIRST');
              INSERT INTO school_reports (enroll_id, school_subject_id, school_term) VALUES (NEW.id, school_subject, 'SECOND');
              INSERT INTO school_reports (enroll_id, school_subject_id, school_term) VALUES (NEW.id, school_subject, 'THIRD');
              INSERT INTO school_reports (enroll_id, school_subject_id, school_term) VALUES (NEW.id, school_subject, 'FOURTH');
            END LOOP;
          END IF;

            RETURN NEW;
        END;
      $create_enroll_school_reports_trigger$

      LANGUAGE plpgsql VOLATILE;
    `);

    await queryRunner.query(/* sql */ `
      CREATE TRIGGER create_enroll_school_reports_trigger
      AFTER INSERT ON enrolls
      FOR EACH ROW
      EXECUTE PROCEDURE create_enroll_school_reports_func();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      DROP TRIGGER IF EXISTS create_enroll_school_reports_trigger ON enrolls;
      DROP FUNCTION IF EXISTS create_enroll_school_reports_func();
    `);
  }
}
