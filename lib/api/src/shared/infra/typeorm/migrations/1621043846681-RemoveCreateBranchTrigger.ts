import { MigrationInterface, QueryRunner } from 'typeorm';

export default class RemoveCreateBranchTrigger1621043846681
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      DROP TRIGGER IF EXISTS create_branch_trigger ON schools;
      DROP FUNCTION IF EXISTS create_branch_func();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      CREATE OR REPLACE FUNCTION create_branch_func()
        RETURNS trigger AS $create_branch_trigger$
        DECLARE
          branch_id uuid;
        BEGIN
          IF (TG_OP = 'INSERT') THEN
            INSERT INTO branchs (description, type) VALUES (new.name, 'SCHOOL') RETURNING id INTO branch_id;

            NEW.branch_id = branch_id;
            RETURN NEW;
          ELSIF (TG_OP = 'UPDATE') THEN
            UPDATE branchs set description = new.name, updated_at = now() WHERE id = old.branch_id;
            RETURN NEW;
          END IF;

          RETURN NULL;
        END;
      $create_branch_trigger$

      LANGUAGE plpgsql VOLATILE;
    `);

    await queryRunner.query(/* sql */ `
      CREATE TRIGGER create_branch_trigger
      BEFORE INSERT OR UPDATE OF name ON schools
      FOR EACH ROW
      EXECUTE PROCEDURE create_branch_func();
    `);
  }
}
