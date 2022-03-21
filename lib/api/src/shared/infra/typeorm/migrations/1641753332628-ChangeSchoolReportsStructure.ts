import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class ChangeSchoolReportsStructure1641753332628
  implements MigrationInterface {
  private columns: TableColumn[];

  constructor() {
    this.columns = [
      new TableColumn({
        name: 'first',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'second',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'first_rec',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'third',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'fourth',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'second_rec',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'exam',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'final_average',
        type: 'integer',
        isNullable: true,
      }),
    ];
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('school_reports', this.columns);
    await queryRunner.query(
      `ALTER TABLE school_reports ALTER COLUMN school_term DROP NOT NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('school_reports', this.columns);
    await queryRunner.query(
      `ALTER TABLE school_reports ALTER COLUMN school_term SET NOT NULL;`,
    );
  }
}
