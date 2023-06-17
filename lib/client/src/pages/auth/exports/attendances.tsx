import { useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import AttendancesReport, { AttendancesReportProps } from 'reports/Attendances';

import { showSchoolTermPeriod } from 'requests/queries/school-term-periods';
import { showClassroom } from 'requests/queries/classrooms';
import { showSchoolSubject } from 'requests/queries/school-subjects';
import { listEnrollClassrooms } from 'requests/queries/enroll-classrooms';
import { listAttendancesByClasses } from 'requests/queries/attendances';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

export default function ClassesReport(props: AttendancesReportProps) {
  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 100);
  }, []);

  return (
    <>
      <Head>
        <title>
          Frequência {props.classroom.description} -{' '}
          {props.schoolSubject.description}
        </title>
      </Head>

      <style jsx global>{`
        @page {
          size: A4 landscape;
          margin-top: 5mm;
          margin-bottom: 5mm;
        }
      `}</style>

      <AttendancesReport {...props} />
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

    const enrollClassrooms = await listEnrollClassrooms(
      {
        classroom_id: classroom.id
      },
      context.req.session
    );

    const { classes, attendances } = await listAttendancesByClasses(
      {
        classroom_id: classroom.id,
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
        classes,
        enrollClassrooms,
        attendances
      }
    };
  }
);
