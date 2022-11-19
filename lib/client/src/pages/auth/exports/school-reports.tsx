import { EnrollClassroom } from 'models/EnrollClassroom';
import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';

import SchoolReportsReport, {
  SchoolReportsReportProps
} from 'reports/SchoolReports';
import { countAttendances } from 'requests/queries/attendances';
import { listEnrollClassrooms } from 'requests/queries/enroll-classrooms';
import { listSchoolReports } from 'requests/queries/school-reports';
import { listSchoolSubjects } from 'requests/queries/school-subjects';

import protectedRoutes from 'utils/protected-routes';

export default function SchoolReports(props: SchoolReportsReportProps) {
  // if (typeof window !== 'undefined') {
  //   console.log(window.chrome);
  // }

  return <SchoolReportsReport {...props} />;
}

const createEnrollClassroom = async (
  session: Session,
  enrollClassroom: EnrollClassroom
) => {
  const { enroll } = enrollClassroom;

  const schoolSubjects = await listSchoolSubjects(session, {
    grade_id: enroll.grade_id,
    include_multidisciplinary: true
  });

  const schoolReports = await listSchoolReports(session, {
    enroll_as: 'last',
    enroll_id: enroll.id
  });

  const attendances = await countAttendances(session, {
    class_id: 'all',
    enroll_id: enroll.id,
    split_by_school_term: true,
    split_by_school_subject: true
  });

  return {
    enrollClassroom,
    schoolSubjects,
    schoolReports,
    attendances
  };
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { classroom_id, enroll_id } = context.query;

  const session = await protectedRoutes(context);
  if (!session) return;

  const enrollClassrooms = await listEnrollClassrooms(session, {
    classroom_id: classroom_id as string,
    enroll_id: enroll_id as string
    // status: 'ACTIVE'
  });

  const enrolls = await Promise.all(
    enrollClassrooms.map((enrollClassroom) =>
      createEnrollClassroom(session, enrollClassroom)
    )
  );

  return {
    props: {
      session,
      enrolls
    }
  };
}
