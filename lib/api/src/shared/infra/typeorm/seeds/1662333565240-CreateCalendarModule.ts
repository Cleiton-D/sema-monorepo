import { MigrationInterface, QueryRunner } from 'typeorm';

type AccessLevel = {
  id: string;
};

export default class CreateCalendarModule1662333565240
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const result: Array<{ id: string }> = await queryRunner.query(
      `INSERT INTO app_modules (description) VALUES ($1) RETURNING id;`,
      ['CALENDAR'],
    );
    const [module] = result;

    const accessLevels: AccessLevel[] = await queryRunner.query(
      `SELECT id FROM access_levels`,
    );

    const promises = accessLevels.map(({ id }) => {
      return queryRunner.query(
        `INSERT INTO access_modules (access_level_id, app_module_id) VALUES ($1, $2)`,
        [id, module.id],
      );
    });

    await Promise.all(promises);
  }

  public async down(): Promise<void> {
    console.log('rollback not possible');
  }
}
