import { MigrationInterface, QueryRunner } from 'typeorm';

type SchoolSubject = {
  id: string;
};

export default class CreateMultidisciplinarySchoolSubject1664130479115
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO school_subjects (description, additional_description, index, is_multidisciplinary)
      VALUES ('Multidisciplinar', 'Disciplina Multidisciplinar', -1, true)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const response: SchoolSubject[] = await queryRunner.query(`
      SELECT id FROM school_subjects WHERE is_multidisciplinary = true
    `);
    if (!response.length) return;

    const [school_subject] = response;
    await queryRunner.query(
      `DELETE FROM school_subjects WHERE id = $1 AND is_multidisciplinary = true`,
      [school_subject.id],
    );
  }
}
