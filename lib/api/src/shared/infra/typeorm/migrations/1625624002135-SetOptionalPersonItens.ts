import { MigrationInterface, QueryRunner } from 'typeorm';

export default class SetOptionalPersonItens1625624002135
  implements MigrationInterface {
  private columns: string[] = [];

  constructor() {
    this.columns = ['mother_name', 'dad_name', 'birth_date', 'address_id'];
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const queries = this.columns.map(
      column => `ALTER TABLE persons ALTER COLUMN ${column} DROP NOT NULL;`,
    );

    await Promise.all(queries.map(query => queryRunner.query(query)));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const queries = this.columns.map(
      column => `ALTER TABLE persons ALTER COLUMN ${column} SET NOT NULL;`,
    );

    await Promise.all(queries.map(query => queryRunner.query(query)));
  }
}
