import { MigrationInterface, QueryRunner } from 'typeorm';

type Timetable = {
  id: string;
  classroom_id: string;
  employee_id: string;
};

type ClassroomTeacherSchoolSubject = {
  school_subject_id?: string;
};

export default class MigrateMultidisciplinaryTimetables1665342373200
  implements MigrationInterface
{
  private async updateItem(
    timetable: Timetable,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const classroom_teacher_school_subjects: ClassroomTeacherSchoolSubject[] =
      await queryRunner.query(
        `
        SELECT school_subject_id
          FROM classroom_teacher_school_subjects classroom_teacher_school_subject
    INNER JOIN school_subjects school_subject ON classroom_teacher_school_subject.school_subject_id = school_subject.id
         WHERE classroom_teacher_school_subject.employee_id = $1
           AND classroom_teacher_school_subject.classroom_id = $2
           AND classroom_teacher_school_subject.deleted_at IS NULL
           AND school_subject.is_multidisciplinary IS TRUE
    `,
        [timetable.employee_id, timetable.classroom_id],
      );

    if (!classroom_teacher_school_subjects?.length) return;
    const [classroom_teacher_school_subject] =
      classroom_teacher_school_subjects;
    if (!classroom_teacher_school_subject?.school_subject_id) return;

    await queryRunner.query(
      `
      UPDATE timetables SET school_subject_id = $2 WHERE id = $1
    `,
      [timetable.id, classroom_teacher_school_subject.school_subject_id],
    );
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const timetables: Timetable[] = await queryRunner.query(`
      SELECT id,
             classroom_id,
             employee_id
        FROM timetables timetable
       WHERE school_subject_id IS NULL
    `);

    if (!timetables?.length) return;

    const updatePromises = timetables.map(timetable =>
      this.updateItem(timetable, queryRunner),
    );
    await Promise.all(updatePromises);
  }

  public async down(): Promise<void> {
    console.log('rollback is not possible');
  }
}
