import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';

import ClassDiaryReportTemplate, {
  ClassDiaryReportTemplateProps
} from 'reports/ClassDiary';

import { Classroom } from 'models/Classroom';
import { SchoolSubject } from 'models/SchoolSubject';

import { listAttendancesByClasses } from 'requests/queries/attendances';
import { listClasses } from 'requests/queries/class';
import { listClassroomTeacherSchoolSubjects } from 'requests/queries/classroom-teacher-school-subjects';
import { showClassroom } from 'requests/queries/classrooms';
import { listEnrollClassrooms } from 'requests/queries/enroll-classrooms';
import { listGradeSchoolSubjects } from 'requests/queries/grade-school-subjects';
import { showGrade } from 'requests/queries/grades';
import { listSchoolSubjects } from 'requests/queries/school-subjects';
import { listSchoolTermPeriods } from 'requests/queries/school-term-periods';

import protectedRoutes from 'utils/protected-routes';
import { listSchoolReports } from 'requests/queries/school-reports';
import { Grade } from 'models/Grade';

export default function ClassDiaryReport(props: ClassDiaryReportTemplateProps) {
  return <ClassDiaryReportTemplate {...props} />;
}

const getItemsBySchoolSubject = async (
  session: Session | null,
  classroom: Classroom,
  grade: Grade,
  schoolSubject: SchoolSubject
) => {
  const [classroomTeacherSchoolSubject] =
    await listClassroomTeacherSchoolSubjects(session, {
      classroom_id: classroom.id,
      school_subject_id: schoolSubject.id,
      is_multidisciplinary: null
    });

  const { classes: minifiedClasses, attendances } =
    await listAttendancesByClasses(session, {
      classroom_id: classroom.id,
      // employee_id: classroomTeacherSchoolSubject.employee_id,
      school_subject_id: schoolSubject.id,
      // school_term: schoolTermPeriod?.school_term,
      sortBy: 'class_date',
      order: 'ASC'
    });

  const classesResponse = await listClasses(session, {
    classroom_id: classroom.id,
    school_subject_id: schoolSubject.id,
    sortBy: 'class_date',
    order: 'ASC'
  });

  const gradeSchoolSubject = await listGradeSchoolSubjects(session, {
    grade_id: classroom.grade_id,
    school_subject_id: schoolSubject.id,
    include_multidisciplinary: true
  });

  const schoolReports = await listSchoolReports(session, {
    classroom_id: classroom.id,
    school_subject_id: !grade.is_multidisciplinary
      ? schoolSubject.id
      : undefined,
    grade_id: grade.id
  });

  return {
    school_subject: schoolSubject,
    classroomTeacherSchoolSubject: classroomTeacherSchoolSubject || null,
    minifiedClasses,
    classes: classesResponse?.items || [],
    attendances,
    gradeSchoolSubject: gradeSchoolSubject?.[0] || null,
    schoolReports
  };
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { classroom_id } = context.query;

  const session = await protectedRoutes(context);
  if (!session) return;

  const classroom = await showClassroom(session, {
    id: classroom_id as string
  });
  const grade = await showGrade(session, classroom.grade_id);
  if (!grade) return;

  const schoolSubjects = await listSchoolSubjects(session, {
    grade_id: grade?.id,
    is_multidisciplinary: grade?.is_multidisciplinary
  });

  const groupedItems = await Promise.all(
    schoolSubjects.map((schoolSubject) =>
      getItemsBySchoolSubject(session, classroom, grade, schoolSubject)
    )
  );

  const enrollClassrooms = await listEnrollClassrooms(session, {
    classroom_id: classroom_id as string
  });

  const schoolTermPeriods = await listSchoolTermPeriods(session, {
    school_year_id: session.configs.school_year_id
  });

  return {
    props: {
      session,
      classroom,
      enrollClassrooms,
      schoolTermPeriods,
      groupedItems
    }
  };
}
