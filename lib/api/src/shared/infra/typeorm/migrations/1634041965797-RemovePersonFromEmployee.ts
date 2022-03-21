import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class RemovePersonFromEmployee1634041965797
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('employees', [
      new TableColumn({
        name: 'name',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'mother_name',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'dad_name',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'gender',
        type: 'enum',
        enum: ['male', 'female'],
        isNullable: true,
      }),
      new TableColumn({
        name: 'address_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'birth_date',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'cpf',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'rg',
        type: 'varchar',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKey(
      'employees',
      new TableForeignKey({
        name: 'employeeAddress',
        columnNames: ['address_id'],
        referencedTableName: 'adresses',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.query(
      `ALTER TABLE employees ALTER COLUMN person_id DROP NOT NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('employees', 'employeeAddress');

    await queryRunner.dropColumn('employees', 'name');
    await queryRunner.dropColumn('employees', 'mother_name');
    await queryRunner.dropColumn('employees', 'dad_name');
    await queryRunner.dropColumn('employees', 'gender');
    await queryRunner.dropColumn('employees', 'address_id');
    await queryRunner.dropColumn('employees', 'birth_date');
    await queryRunner.dropColumn('employees', 'cpf');
    await queryRunner.dropColumn('employees', 'rg');

    await queryRunner.query(
      `ALTER TABLE employees ALTER COLUMN person_id SET NOT NULL;`,
    );
  }
}
