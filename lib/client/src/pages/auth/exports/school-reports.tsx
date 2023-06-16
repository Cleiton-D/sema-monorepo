import { EnrollClassroom } from 'models/EnrollClassroom';
import { GetServerSidePropsContext } from 'next';

import SchoolReportsReport, {
  SchoolReportsReportProps
} from 'reports/SchoolReports';
import { countAttendances } from 'requests/queries/attendances';
import { listEnrollClassrooms } from 'requests/queries/enroll-classrooms';
import { listSchoolReports } from 'requests/queries/school-reports';
import { listSchoolSubjects } from 'requests/queries/school-subjects';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

export default function SchoolReports(props: SchoolReportsReportProps) {
  // if (typeof window !== 'undefined') {
  //   console.log(window.chrome);
  // }

  return <SchoolReportsReport {...props} />;
}

const createEnrollClassroom = async (
  context: GetServerSidePropsContext,
  enrollClassroom: EnrollClassroom
) => {
  const { enroll } = enrollClassroom;

  const schoolSubjects = await listSchoolSubjects(
    {
      grade_id: enroll.grade_id,
      include_multidisciplinary: true,
      school_year_id: context.req.fullSession?.schoolYear.id
    },
    context.req.session
  );

  const schoolReports = await listSchoolReports(
    {
      enroll_as: 'last',
      enroll_id: enroll.id
    },
    context.req.session
  );

  const attendances = await countAttendances(
    {
      class_id: 'all',
      enroll_id: enroll.id,
      split_by_school_term: true,
      split_by_school_subject: true
    },
    context.req.session
  );

  return {
    enrollClassroom,
    schoolSubjects,
    schoolReports,
    attendances
  };
};

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const { classroom_id, enroll_id } = context.query;

    const enrollClassrooms = await listEnrollClassrooms(
      {
        classroom_id: classroom_id as string,
        enroll_id: enroll_id as string
        // status: 'ACTIVE'
      },
      context.req.session
    );

    const enrolls = await Promise.all(
      enrollClassrooms.map((enrollClassroom) =>
        createEnrollClassroom(context, enrollClassroom)
      )
    );

    return {
      props: {
        enrolls
      }
    };
  }
);
