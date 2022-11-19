import { MigrationInterface, QueryRunner } from 'typeorm';

type Class = {
  id: string;
  classroom_id: string;
  employee_id: string;
};

type ClassroomTeacherSchoolSubject = {
  school_subject_id?: string;
};

export default class MigrateMultidisciplinaryClasses1665345027332
  implements MigrationInterface
{
  private async updateItem(
    classEntity: Class,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const classroom_teacher_school_subjects: ClassroomTeacherSchoolSubject[] =
      await queryRunner.query(
        `
        SELECT school_subject_id
          FROM classroom_teacher_school_subjects classroom_teacher_school_subject
    INNER JOIN school_subjects school_subject ON classroom_teacher_school_subject.school_subject_id = school_subject.id
         WHERE 1 = 1
           AND classroom_teacher_school_subject.classroom_id = $1
           AND classroom_teacher_school_subject.deleted_at IS NULL
           AND school_subject.is_multidisciplinary IS TRUE
    `,
        [classEntity.classroom_id],
      );

    if (!classroom_teacher_school_subjects?.length) return;
    const [classroom_teacher_school_subject] =
      classroom_teacher_school_subjects;
    if (!classroom_teacher_school_subject?.school_subject_id) return;

    await queryRunner.query(
      `
      UPDATE classes SET school_subject_id = $2 WHERE id = $1
    `,
      [classEntity.id, classroom_teacher_school_subject.school_subject_id],
    );
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const classes: Class[] = await queryRunner.query(`
      SELECT id,
             classroom_id,
             employee_id
        FROM classes
       WHERE school_subject_id IS NULL
         AND deleted_at IS NULL
    `);
    if (!classes?.length) return;

    const updatePromises = classes.map(classEntity =>
      this.updateItem(classEntity, queryRunner),
    );
    await Promise.all(updatePromises);
  }

  public async down(): Promise<void> {
    console.log('rollback is not possible');
  }
}
