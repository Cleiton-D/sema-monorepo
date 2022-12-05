import { MigrationInterface, QueryRunner } from 'typeorm';

type Class = {
  id: string;
};

export default class AddClassesToHeitorBanzza1670211215143
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const classes: Class[] = await queryRunner.query(`
      SELECT c.id as id
        FROM classes c
       WHERE c.deleted_at IS NULL
         AND c.classroom_id = 'f8805cf8-d9f0-4ea8-b228-9172f62f6798'
         AND NOT EXISTS (SELECT 1
                           FROM attendances a
                          WHERE a.class_id = c.id
                            AND a.enroll_id = '0ea3ac67-8136-4ed5-9a07-2fcae0145131'
                            AND a.deleted_at IS NULL)
    `);

    if (!classes?.length) return;

    const insertStatements = classes.map(({ id }) => {
      return queryRunner.query(
        `INSERT INTO attendances(enroll_id, class_id, enroll_classroom_id, attendance) VALUES ($1, $2, $3, true);`,
        [
          '0ea3ac67-8136-4ed5-9a07-2fcae0145131',
          id,
          '8329b6b7-4bed-436a-bec9-8bb06dd5e165',
        ],
      );
    });

    await Promise.all(insertStatements);
  }

  public async down(): Promise<void> {
    console.log('rollback is not possible');
  }
}
