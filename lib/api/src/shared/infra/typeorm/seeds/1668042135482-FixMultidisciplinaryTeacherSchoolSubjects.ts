import { MigrationInterface, QueryRunner } from 'typeorm';

type MultidisciplinaryGrade = {
  grade_id: string;
  school_subject_id: string;
};

type MissingClassroomTeacherSchoolSubject = {
  classroom_id: string;
  school_subject_id: string;
  employee_id: string;
};

export default class FixMultidisciplinaryTeacherSchoolSubjects1668042135482
  implements MigrationInterface
{
  private async createMissingRegistries(
    queryRunner: QueryRunner,
    { grade_id, school_subject_id }: MultidisciplinaryGrade,
  ) {
    const missingClassroomTeacherSchoolSubject: MissingClassroomTeacherSchoolSubject[] =
      await queryRunner.query(
        `
      SELECT c.id AS classroom_id,
             ss.id AS school_subject_id,
             mctss.employee_id
        FROM school_subjects ss
  INNER JOIN grade_school_subjects gss ON gss.school_subject_id = ss.id
  INNER JOIN grades g ON g.id = gss.grade_id
  INNER JOIN classrooms c ON c.grade_id = g.id
  INNER JOIN (SELECT ctss2.classroom_id,
                     ctss2.employee_id
                FROM classroom_teacher_school_subjects ctss2
               WHERE ctss2.school_subject_id = $1
                 AND ctss2.deleted_at IS NULL) mctss ON mctss.classroom_id = c.id
       WHERE g.id = $2
         AND ss.id NOT IN (SELECT ctss.school_subject_id
                             FROM classroom_teacher_school_subjects ctss
                            WHERE ctss.classroom_id = c.id
                              AND ctss.school_subject_id = ss.id
                              AND ctss.deleted_at IS NULL)
    GROUP BY c.id,
             ss.id,
             mctss.employee_id
    `,
        [school_subject_id, grade_id],
      );

    if (!missingClassroomTeacherSchoolSubject.length) return;

    const promises = missingClassroomTeacherSchoolSubject.map(item => {
      return queryRunner.query(
        `
          INSERT INTO classroom_teacher_school_subjects (classroom_id, employee_id, school_subject_id) VALUES ($1, $2, $3)
        `,
        [item.classroom_id, item.employee_id, item.school_subject_id],
      );
    });

    await Promise.all(promises);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const multidisciplinaries_grades: MultidisciplinaryGrade[] =
      await queryRunner.query(`
      SELECT DISTINCT(grade_school_subject.grade_id) AS grade_id,
             school_subject.id AS school_subject_id
        FROM grade_school_subjects grade_school_subject
  INNER JOIN school_subjects school_subject ON school_subject.id = grade_school_subject.school_subject_id
       WHERE school_subject.is_multidisciplinary = true
         AND grade_school_subject.deleted_at IS null
    `);

    if (!multidisciplinaries_grades?.length) return;

    const promises = multidisciplinaries_grades.map(item =>
      this.createMissingRegistries(queryRunner, item),
    );

    await Promise.all(promises);
  }

  public async down(): Promise<void> {
    console.log('rollback is not possible');
  }
}
