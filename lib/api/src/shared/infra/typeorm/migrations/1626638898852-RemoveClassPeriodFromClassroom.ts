import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class RemoveClassPeriodFromClassroom1626638898852
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      CREATE TYPE ClassPeriod AS ENUM (
        'MORNING',
        'EVENING',
        'NOCTURNAL'
      );
    `);

    await queryRunner.addColumn(
      'classrooms',
      new TableColumn({
        name: 'class_period',
        type: 'ClassPeriod',
        isNullable: true,
      }),
    );

    await queryRunner.query(/* sql */ `
      DO
      $$
      DECLARE
        classroom RECORD;
        classperiod ClassPeriod;
      BEGIN
        FOR classroom IN SELECT * FROM classrooms
        LOOP
          SELECT description INTO classperiod FROM class_periods WHERE id = classroom."class_period_id";
          UPDATE classrooms SET class_period = classperiod WHERE id = classroom."id";
        END LOOP;
      END
      $$
    `);

    await queryRunner.query(
      `ALTER TABLE classrooms ALTER COLUMN class_period SET NOT NULL;`,
    );

    await queryRunner.dropForeignKey('classrooms', 'ClassRoomClassPeriod');
    await queryRunner.dropColumn('classrooms', 'class_period_id');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('classrooms', 'class_period');

    await queryRunner.query(`DROP TYPE ClassPeriod;`);

    await queryRunner.addColumn(
      'classrooms',
      new TableColumn({
        name: 'class_period_id',
        type: 'uuid',
      }),
    );
    await queryRunner.createForeignKey(
      'classrooms',
      new TableForeignKey({
        name: 'ClassRoomClassPeriod',
        columnNames: ['class_period_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'class_periods',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }
}
