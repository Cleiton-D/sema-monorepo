import { MigrationInterface, QueryRunner } from 'typeorm';

type ClassPeriodResult = {
  id: string;
  description: string;
};

const ClassPeriods: Record<string, string> = {
  MORNING: 'Matutino',
  EVENING: 'Vespertino',
  NOCTURNAL: 'Noturno',
};

export default class AlterClassperiodDescriptionType1652747243070
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();

    const currentClassPeriods: ClassPeriodResult[] = await queryRunner.query(`
      SELECT id, description from class_periods
    `);
    await queryRunner.query(`
      ALTER TABLE class_periods DROP COLUMN description;
    `);
    await queryRunner.commitTransaction();

    await queryRunner.startTransaction();
    await queryRunner.query(`
      ALTER TABLE class_periods ADD description varchar NULL;
    `);
    await queryRunner.commitTransaction();

    await queryRunner.startTransaction();
    const promises = currentClassPeriods
      ? currentClassPeriods.map(({ id, description }) => {
          const newDescription = ClassPeriods[description] || description;

          return queryRunner.query(
            `UPDATE class_periods SET description = $2 WHERE id = $1`,
            [id, newDescription],
          );
        })
      : [];

    await Promise.all(promises);

    await queryRunner.query(`
      ALTER TABLE class_periods ALTER COLUMN description SET NOT NULL;
    `);
    await queryRunner.commitTransaction();
  }

  public async down(): Promise<void> {
    console.log('not possible revert');
  }
}
