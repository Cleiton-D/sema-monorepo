import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class CreateNewStudentsTable1636206321746
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('students', 'StudentPerson');
    await queryRunner.dropColumn('students', 'person_id');

    await queryRunner.addColumns('students', [
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
      new TableColumn({
        name: 'birth_certificate',
        type: 'varchar',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKey(
      'students',
      new TableForeignKey({
        name: 'studentAddress',
        columnNames: ['address_id'],
        referencedTableName: 'adresses',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('students', 'studentAddress');

    await queryRunner.dropColumn('students', 'name');
    await queryRunner.dropColumn('students', 'mother_name');
    await queryRunner.dropColumn('students', 'dad_name');
    await queryRunner.dropColumn('students', 'gender');
    await queryRunner.dropColumn('students', 'address_id');
    await queryRunner.dropColumn('students', 'birth_date');
    await queryRunner.dropColumn('students', 'cpf');
    await queryRunner.dropColumn('students', 'rg');
    await queryRunner.dropColumn('students', 'birth_certificate');

    await queryRunner.addColumn(
      'students',
      new TableColumn({
        name: 'person_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'students',
      new TableForeignKey({
        name: 'StudentPerson',
        columnNames: ['person_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'persons',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }
}
