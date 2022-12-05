import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddTypesToEnrollStatus1669235633932
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'enrolls',
      'status',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: [
          'ACTIVE',
          'INACTIVE',
          'TRANSFERRED',
          'QUITTER',
          'DECEASED',
          'APPROVED',
          'DISAPPROVED',
          'RECOVERY',
          'EXAM',
          'DISAPPROVED_FOR_ABSENCES',
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'enrolls',
      'status',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: [
          'ACTIVE',
          'INACTIVE',
          'TRANSFERRED',
          'QUITTER',
          'DECEASED',
          'APPROVED',
          'DISAPPROVED',
        ],
      }),
    );
  }
}
