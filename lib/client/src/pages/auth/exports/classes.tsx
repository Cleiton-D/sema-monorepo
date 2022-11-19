import { useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import Classes, { ClassesReportProps } from 'reports/Classes';

import { listClasses } from 'requests/queries/class';

import { showClassroom } from 'requests/queries/classrooms';
import { listGradeSchoolSubjects } from 'requests/queries/grade-school-subjects';
import { showSchoolSubject } from 'requests/queries/school-subjects';
import { showSchoolTermPeriod } from 'requests/queries/school-term-periods';

import protectedRoutes from 'utils/protected-routes';

export default function ClassesReport(props: ClassesReportProps) {
  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 100);
  }, []);

  return (
    <>
      <Head>
        <title>Relatório de aulas</title>
      </Head>

      <style jsx global>{`
        @page {
          size: A4;
          margin-top: 5mm;
          margin-bottom: 5mm;
        }
      `}</style>

      <Classes {...props} />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { classroom_id, school_subject_id, school_term_period_id } =
    context.query;

  const session = await protectedRoutes(context);
  if (!session) return;

  const schoolTermPeriod = school_term_period_id
    ? await showSchoolTermPeriod(session, {
        id: school_term_period_id as string
      })
    : null;

  const classroom = await showClassroom(session, {
    id: classroom_id as string
  });

  const schoolSubject = await showSchoolSubject(
    session,
    school_subject_id as string
  );

  const gradeSchoolSubject = await listGradeSchoolSubjects(session, {
    grade_id: classroom.grade_id,
    school_subject_id: school_subject_id as string,
    include_multidisciplinary: true
  });

  const classes = await listClasses(session, {
    classroom_id: classroom_id as string,
    // employee_id: classroomTeacherSchoolSubject.employee_id,
    school_subject_id: school_subject_id as string,
    school_term: schoolTermPeriod?.school_term,
    sortBy: 'class_date',
    order: 'ASC'
  });

  return {
    props: {
      session,
      classroom,
      schoolSubject,
      schoolTermPeriod,
      gradeSchoolSubject: gradeSchoolSubject?.[0] || null,
      classes: classes?.items || []
    }
  };
}
