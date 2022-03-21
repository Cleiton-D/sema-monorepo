import { MigrationInterface, QueryRunner } from 'typeorm';

type Enroll = {
  id: string;
  created_at: string;
};

export default class SeedEnrollDate1647797719104 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const enrolls: Enroll[] = await queryRunner.query(`
      SELECT id, created_at FROM enrolls
    `);

    const queries = enrolls.map(enroll => {
      const query = `UPDATE enrolls SET enroll_date = $1 WHERE id = $2`;
      const params = [enroll.created_at, enroll.id];

      return queryRunner.query(query, params);
    });

    await Promise.all(queries);
  }

  public async down(): Promise<void> {
    console.log('revert is not possible');
  }
}
