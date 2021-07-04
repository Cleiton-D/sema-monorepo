import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddBranchIdToSchool1616276997603
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'schools',
      new TableColumn({ name: 'branch_id', type: 'uuid', isNullable: false }),
    );

    await queryRunner.createForeignKey(
      'schools',
      new TableForeignKey({
        name: 'SchoolBranch',
        columnNames: ['branch_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branchs',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('schools', 'SchoolBranch');
    await queryRunner.dropColumn('schools', 'branch_id');
  }
}
