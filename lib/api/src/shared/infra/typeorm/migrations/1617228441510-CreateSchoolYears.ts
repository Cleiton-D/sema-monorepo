import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSchoolYears1617228441510
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'school_years',
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
            name: 'reference_year',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('school_years');
  }
}
