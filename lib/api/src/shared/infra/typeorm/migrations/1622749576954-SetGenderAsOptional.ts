import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class SetGenderAsOptional1622749576954
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'persons',
      'gender',
      new TableColumn({
        name: 'gender',
        type: 'enum',
        enum: ['male', 'female'],
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'persons',
      'gender',
      new TableColumn({
        name: 'gender',
        type: 'enum',
        enum: ['male', 'female'],
        isNullable: false,
      }),
    );
  }
}
