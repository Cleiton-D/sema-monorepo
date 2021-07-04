import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class UpdateUserEmployeeLogic1618109430366
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('users', 'UsersEmployees');
    await queryRunner.dropColumn('users', 'employee_id');

    await queryRunner.addColumn(
      'employees',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
      }),
    );
    await queryRunner.createForeignKey(
      'employees',
      new TableForeignKey({
        name: 'EmployeesUsers',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'employee_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: 'UsersEmployees',
        columnNames: ['employee_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employees',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.dropForeignKey('employees', 'EmployeesUsers');
    await queryRunner.dropColumn('employees', 'user_id');
  }
}
