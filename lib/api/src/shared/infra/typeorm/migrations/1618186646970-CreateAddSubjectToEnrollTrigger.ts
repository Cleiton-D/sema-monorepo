import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateAddSubjectToEnrollTrigger1618186646970
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      CREATE OR REPLACE FUNCTION create_subject_to_enroll_func()
        RETURNS trigger AS $create_subject_to_enroll_trigger$
        DECLARE
          enrolls uuid[];
          enroll uuid;
        BEGIN
          enrolls := ARRAY(SELECT id FROM enrolls WHERE grade_id = NEW.grade_id AND school_year_id = NEW.school_year_id);

          IF array_length(enrolls, 1) > 0 THEN
            FOREACH enroll IN ARRAY enrolls
            LOOP
              INSERT INTO school_reports (enroll_id, school_subject_id, school_term) VALUES (enroll, NEW.school_subject_id, 'FIRST');
              INSERT INTO school_reports (enroll_id, school_subject_id, school_term) VALUES (enroll, NEW.school_subject_id, 'SECOND');
              INSERT INTO school_reports (enroll_id, school_subject_id, school_term) VALUES (enroll, NEW.school_subject_id, 'THIRD');
              INSERT INTO school_reports (enroll_id, school_subject_id, school_term) VALUES (enroll, NEW.school_subject_id, 'FOURTH');
            END LOOP;
          END IF;

          RETURN NEW;
        END;
      $create_subject_to_enroll_trigger$

      LANGUAGE plpgsql VOLATILE;
    `);

    await queryRunner.query(/* sql */ `
      CREATE TRIGGER create_subject_to_enroll_trigger
      AFTER INSERT ON grade_school_subjects
      FOR EACH ROW
      EXECUTE PROCEDURE create_subject_to_enroll_func();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      DROP TRIGGER IF EXISTS create_subject_to_enroll_trigger ON grade_school_subjects;
      DROP FUNCTION IF EXISTS create_subject_to_enroll_func();
    `);
  }
}
