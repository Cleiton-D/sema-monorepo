import { MigrationInterface, QueryRunner } from 'typeorm';

export default class RemoveGradeSchoolSubjectTrigger1618189653162
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      CREATE OR REPLACE FUNCTION remove_subject_from_enroll_func()
        RETURNS trigger AS $remove_subject_from_enroll_trigger$
        DECLARE
          enrolls uuid[];
        BEGIN
          enrolls := ARRAY(SELECT id FROM enrolls WHERE grade_id = OLD.grade_id AND school_year_id = OLD.school_year_id);

          IF array_length(enrolls, 1) > 0 THEN
            DELETE FROM school_reports WHERE school_subject_id = OLD.school_subject_id AND enroll_id IN (enrolls);
          END IF;
        END;
      $remove_subject_from_enroll_trigger$

      LANGUAGE plpgsql VOLATILE;
    `);

    await queryRunner.query(/* sql */ `
      CREATE TRIGGER remove_subject_from_enroll_trigger
      AFTER DELETE ON grade_school_subjects
      FOR EACH ROW
      EXECUTE PROCEDURE remove_subject_from_enroll_func();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
    DROP TRIGGER IF EXISTS remove_subject_from_enroll_trigger ON grade_school_subjects;
    DROP FUNCTION IF EXISTS remove_subject_from_enroll_func();
  `);
  }
}
