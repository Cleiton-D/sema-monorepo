import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateMultidisciplinarySchoolSubjectTrigger1664130678742
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      CREATE OR REPLACE FUNCTION verify_school_subject_multidisciplinary_func()
        RETURNS trigger AS $verify_school_subject_multidisciplinary_trigger$
        DECLARE
          school_subject uuid;
        BEGIN
          IF (NEW.is_multidisciplinary = false) THEN
            RETURN NEW;
          END IF;

          SELECT id INTO school_subject FROM school_subjects WHERE is_multidisciplinary = true;
          IF (school_subject IS NOT NULL) THEN
            IF (TG_OP = 'INSERT') THEN
              RAISE EXCEPTION 'is_multidisciplinary school subject already exist';
            ELSIF (TG_OP = 'UPDATE') THEN
              IF (school_subject <> OLD.id) THEN
                RAISE EXCEPTION 'is_multidisciplinary school subject already exist';
              END IF;
            END IF;
          END IF;

          RETURN NEW;
        END;
      $verify_school_subject_multidisciplinary_trigger$

      LANGUAGE plpgsql VOLATILE;
    `);

    await queryRunner.query(/* sql */ `
      CREATE TRIGGER verify_school_subject_multidisciplinary_trigger
      BEFORE INSERT OR UPDATE OF is_multidisciplinary ON school_subjects
      FOR EACH ROW
      EXECUTE PROCEDURE verify_school_subject_multidisciplinary_func();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      DROP TRIGGER IF EXISTS verify_school_subject_multidisciplinary_trigger ON school_subjects;
      DROP FUNCTION IF EXISTS verify_school_subject_multidisciplinary_func();
    `);
  }
}
