import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddDirectorsToSchool1624221234408
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.addColumn(
        'schools',
        new TableColumn({
          name: 'director_id',
          type: 'uuid',
          isNullable: true,
        }),
      ),
      queryRunner.addColumn(
        'schools',
        new TableColumn({
          name: 'vice_director_id',
          type: 'uuid',
          isNullable: true,
        }),
      ),
    ]);

    await Promise.all([
      queryRunner.createForeignKey(
        'schools',
        new TableForeignKey({
          name: 'SchoolDirector',
          columnNames: ['director_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'employees',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      ),
      queryRunner.createForeignKey(
        'schools',
        new TableForeignKey({
          name: 'SchoolViceDirector',
          columnNames: ['vice_director_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'employees',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.dropForeignKey('schools', 'SchoolDirector'),
      queryRunner.dropForeignKey('schools', 'SchoolViceDirector'),
    ]);

    await Promise.all([
      queryRunner.dropColumn('schools', 'director_id'),
      queryRunner.dropColumn('schools', 'vice_director_id'),
    ]);
  }
}
