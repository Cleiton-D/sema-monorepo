import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddNameToUserEntity1619297738174
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'username',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.query(/* sql */ `
      DO $populate_username$
      DECLARE
        users uuid[];
        app_user uuid;
        person_name varchar;
      BEGIN
        users := ARRAY(SELECT id FROM users);

        IF array_length(users, 1) > 0 THEN
          FOREACH app_user IN ARRAY users
          LOOP
            SELECT persons.name INTO person_name FROM persons JOIN employees ON(employees.person_id = persons.id) WHERE employees.user_id = app_user;
            UPDATE users set username = person_name WHERE id = app_user;
          END LOOP;
        END IF;
      END;
      $populate_username$
    `);

    await queryRunner.changeColumn(
      'users',
      'username',
      new TableColumn({
        name: 'username',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'username');
  }
}
