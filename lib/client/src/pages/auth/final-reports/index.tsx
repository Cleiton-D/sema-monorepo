import { GetServerSidePropsContext } from 'next';

import FinalReportsTemplate from 'templates/FinalReports';

import { listClassrooms, classroomsKeys } from 'requests/queries/classrooms';

import protectedRoutes from 'utils/protected-routes';
import prefetchQuery from 'utils/prefetch-query';

function ClassesReportsPage() {
  return <FinalReportsTemplate />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const filters = {
    school_id: session?.schoolId,
    employee_id: session?.user.employeeId,
    page: 1,
    size: 20
  };

  const dehydratedState = await prefetchQuery([
    {
      key: classroomsKeys.list(JSON.stringify(filters)),
      fetcher: () => listClassrooms(session, filters)
    }
  ]);

  return {
    props: {
      session,
      dehydratedState
    }
  };
}

export default ClassesReportsPage;
