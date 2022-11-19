import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class CreateMultidisciplinarySchoolSubject1664130235802
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'school_subjects',
      new TableColumn({
        name: 'is_multidisciplinary',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('school_subjects', 'is_multidisciplinary');
  }
}
