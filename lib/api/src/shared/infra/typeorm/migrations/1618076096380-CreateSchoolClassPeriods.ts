import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSchoolClassPeriods1618076096380
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'school_class_periods',
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
            name: 'school_id',
            type: 'uuid',
          },
          {
            name: 'class_period_id',
            type: 'uuid',
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
            name: 'SchoolClassPeriodSchool',
            columnNames: ['school_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'schools',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'SchoolClassPeriodClassPeriod',
            columnNames: ['class_period_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'class_periods',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'SchoolClassPeriodSchoolYear',
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
    await Promise.all([
      queryRunner.dropForeignKey(
        'school_class_periods',
        'SchoolClassPeriodSchool',
      ),
      queryRunner.dropForeignKey(
        'school_class_periods',
        'SchoolClassPeriodClassPeriod',
      ),
      queryRunner.dropForeignKey(
        'school_class_periods',
        'SchoolClassPeriodSchoolYear',
      ),
    ]);

    await queryRunner.dropTable('school_class_periods');
  }
}
