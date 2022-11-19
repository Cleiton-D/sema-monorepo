import { MigrationInterface, QueryRunner } from 'typeorm';

type Multidisciplinary = {
  classroom_id: string;
  employee_id: string;
  grade_id: string;
};

type SchoolSubject = {
  school_subject_id: string;
  employee_id: string;
  classroom_id: string;
};

export default class CompleteMultidisciplinary1657070101793
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const multidisciplinaries: Multidisciplinary[] = await queryRunner.query(`
      SELECT ct.classroom_id,
             ct.employee_id,
             c.grade_id
        FROM classroom_teacher_school_subjects ct
  INNER JOIN classrooms c ON (c.id = ct.classroom_id)
       WHERE ct.is_multidisciplinary = true
         AND ct.deleted_at IS NULL
         AND c.deleted_at IS NULL
    `);

    if (!multidisciplinaries?.length) return;

    const promises = multidisciplinaries.map(
      async ({ classroom_id, employee_id, grade_id }) => {
        const schoolSubjects: SchoolSubject[] = await queryRunner.query(
          `
          SELECT gssc.school_subject_id,
                 empl.id as employee_id,
                 clsr.id as classroom_id
            FROM grade_school_subjects gssc
      INNER JOIN employees empl ON (empl.id = $2)
      INNER JOIN classrooms clsr ON (clsr.id = $3)
           WHERE gssc.grade_id = $1
             AND gssc.deleted_at IS NULL
             AND NOT EXISTS (
              SELECT 1
                FROM classroom_teacher_school_subjects ct
               WHERE ct.employee_id = $2
                 AND ct.classroom_id = $3
                 AND ct.school_subject_id = gssc.school_subject_id
             )
        `,
          [grade_id, employee_id, classroom_id],
        );

        return schoolSubjects;
      },
    );

    const schoolSubjects = await (
      await Promise.all(promises)
    ).reduce((acc, item) => [...acc, ...item], []);

    const newItems = schoolSubjects.map(
      ({ classroom_id, employee_id, school_subject_id }) => {
        return queryRunner.query(
          `
          INSERT INTO classroom_teacher_school_subjects (classroom_id, employee_id, school_subject_id)
               VALUES ($1, $2, $3)
        `,
          [classroom_id, employee_id, school_subject_id],
        );
      },
    );

    await Promise.all(newItems);
  }

  public async down(): Promise<void> {
    console.log('revert unavailable');
  }
}
