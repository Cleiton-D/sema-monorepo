import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class DeleteClassPeriodTable1626647233692
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('class_periods');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'class_periods',
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
            name: 'description',
            type: 'enum',
            enum: ['MORNING', 'EVENING', 'NOCTURNAL'],
          },
          {
            name: 'time_start',
            type: 'time',
          },
          {
            name: 'time_end',
            type: 'time',
          },
          {
            name: 'class_time',
            type: 'time',
          },
          {
            name: 'break_time',
            type: 'time',
          },
          {
            name: 'break_time_start',
            type: 'time',
          },
          {
            name: 'school_year_id',
            type: 'uuid',
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
            name: 'ClassPeriodSchoolYear',
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
}
