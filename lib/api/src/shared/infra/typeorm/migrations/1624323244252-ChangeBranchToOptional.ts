import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class ChangeBranchToOptional1624323244252
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user_profiles',
      'branch_id',
      new TableColumn({
        name: 'branch_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user_profiles',
      'branch_id',
      new TableColumn({
        name: 'branch_id',
        type: 'uuid',
        isNullable: false,
      }),
    );
  }
}
