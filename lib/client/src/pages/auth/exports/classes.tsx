import { useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import Classes, { ClassesReportProps } from 'reports/Classes';

import { listClasses } from 'requests/queries/class';

import { showClassroom } from 'requests/queries/classrooms';
import { listGradeSchoolSubjects } from 'requests/queries/grade-school-subjects';
import { showSchoolSubject } from 'requests/queries/school-subjects';
import { showSchoolTermPeriod } from 'requests/queries/school-term-periods';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

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

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const { classroom_id, school_subject_id, school_term_period_id } =
      context.query;

    const schoolTermPeriod = school_term_period_id
      ? await showSchoolTermPeriod(
          {
            id: school_term_period_id as string
          },
          context.req.session
        )
      : null;

    const classroom = await showClassroom(
      {
        id: classroom_id as string
      },
      context.req.session
    );

    const schoolSubject = await showSchoolSubject(
      school_subject_id as string,
      context.req.session
    );

    const gradeSchoolSubject = await listGradeSchoolSubjects(
      {
        grade_id: classroom.grade_id,
        school_subject_id: school_subject_id as string,
        include_multidisciplinary: true
      },
      context.req.session
    );

    const classes = await listClasses(
      {
        classroom_id: classroom_id as string,
        // employee_id: classroomTeacherSchoolSubject.employee_id,
        school_subject_id: school_subject_id as string,
        school_term: schoolTermPeriod?.school_term,
        sortBy: 'class_date',
        order: 'ASC'
      },
      context.req.session
    );

    return {
      props: {
        classroom,
        schoolSubject,
        schoolTermPeriod,
        gradeSchoolSubject: gradeSchoolSubject?.[0] || null,
        classes: classes?.items || []
      }
    };
  }
);
