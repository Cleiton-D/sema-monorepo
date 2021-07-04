import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSchoolTermPeriods1620497675068
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      CREATE TYPE SchoolTerm AS ENUM (
        'FIRST',
        'SECOND',
        'THIRD',
        'FOURTH'
      );
    `);

    await queryRunner.createTable(
      new Table({
        name: 'school_term_periods',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'school_year_id',
            type: 'uuid',
          },
          {
            name: 'school_term',
            type: 'SchoolTerm',
          },
          {
            name: 'date_start',
            type: 'timestamp without time zone',
          },
          {
            name: 'date_end',
            type: 'timestamp without time zone',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'SchoolTermPeriodSchoolYear',
            columnNames: ['school_year_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'school_years',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'school_term_periods',
      'SchoolTermPeriodSchoolYear',
    );
    await queryRunner.dropTable('school_term_periods');
    await queryRunner.query(/* sql */ `
      DROP TYPE SchoolTerm;
    `);
  }
}
