import { useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import AttendancesReport, { AttendancesReportProps } from 'reports/Attendances';

import { showSchoolTermPeriod } from 'requests/queries/school-term-periods';
import { showClassroom } from 'requests/queries/classrooms';
import { showSchoolSubject } from 'requests/queries/school-subjects';
import { listEnrollClassrooms } from 'requests/queries/enroll-classrooms';
import { listAttendancesByClasses } from 'requests/queries/attendances';

import protectedRoutes from 'utils/protected-routes';

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

  const enrollClassrooms = await listEnrollClassrooms(session, {
    classroom_id: classroom.id
  });

  const { classes, attendances } = await listAttendancesByClasses(session, {
    classroom_id: classroom.id,
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
      classes,
      enrollClassrooms,
      attendances
    }
  };
}
