import { MigrationInterface, QueryRunner } from 'typeorm';

type MultidisciplinaryItem = {
  id: string;
  multidisciplinary_school_subject: string;
};

export default class MigrateMultidisciplinaryClassroomTeacherSchoolSubjects1665336071108
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items: MultidisciplinaryItem[] = await queryRunner.query(`
      SELECT classroom_teacher_school_subject.id,
             (SELECT school_subject.id
                FROM grade_school_subjects grade_school_subject
          INNER JOIN school_subjects school_subject ON school_subject.id = grade_school_subject.school_subject_id
               WHERE school_subject.is_multidisciplinary = TRUE
                 AND grade_school_subject.deleted_at IS NULL
                 AND grade_school_subject.grade_id = grade.id
          LIMIT 1) AS multidisciplinary_school_subject
        FROM classroom_teacher_school_subjects classroom_teacher_school_subject
  INNER JOIN classrooms classroom ON classroom.id = classroom_teacher_school_subject.classroom_id
  INNER JOIN grades grade ON grade.id = classroom.grade_id
       WHERE classroom_teacher_school_subject.is_multidisciplinary = true
         AND classroom_teacher_school_subject.deleted_at IS NULL
         AND classroom_teacher_school_subject.school_subject_id IS NULL
         AND classroom.deleted_at IS NULL
    `);

    if (!items?.length) return;

    const updates = items.map(({ id, multidisciplinary_school_subject }) => {
      return queryRunner.query(
        `
          UPDATE classroom_teacher_school_subjects SET school_subject_id = $2 WHERE id = $1
      `,
        [id, multidisciplinary_school_subject],
      );
    });

    await Promise.all(updates);
    // console.log(items);

    // throw new Error('teste');
  }

  public async down(): Promise<void> {
    console.log('rollback is not possible');
  }
}
