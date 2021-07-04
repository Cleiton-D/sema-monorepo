import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddPisDocumentType1615163419621
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'person_documents',
      'document_type',
      new TableColumn({
        name: 'document_type',
        type: 'enum',
        enum: ['RG', 'CPF', 'CNH', 'PIS-PASEP'],
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'person_documents',
      'document_type',
      new TableColumn({
        name: 'document_type',
        type: 'enum',
        enum: ['RG', 'CPF', 'CNH'],
        isNullable: false,
      }),
    );
  }
}
