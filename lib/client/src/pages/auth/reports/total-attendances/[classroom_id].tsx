import { GetServerSidePropsContext } from 'next';

import AttendancesReportTemplate from 'templates/AttendancesReportPage';

import { listSchoolTermPeriods } from 'requests/queries/school-term-periods';
import { classroomsKeys, showClassroom } from 'requests/queries/classrooms';

import protectedRoutes from 'utils/protected-routes';
import prefetchQuery from 'utils/prefetch-query';

const AttendancesReportPage = () => {
  return <AttendancesReportTemplate />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const classroom_id = context.params!.classroom_id;

  const dehydratedState = await prefetchQuery([
    {
      key: `list-school-term-periods-${JSON.stringify({
        school_year_id: session?.configs.school_year_id
      })}`,
      fetcher: () =>
        listSchoolTermPeriods(session, {
          school_year_id: session?.configs.school_year_id
        })
    },
    {
      key: classroomsKeys.show(JSON.stringify({ id: classroom_id })),
      fetcher: () => showClassroom(session, { id: classroom_id as string })
    }
  ]);

  return {
    props: {
      session,
      dehydratedState
    }
  };
}

export default AttendancesReportPage;
