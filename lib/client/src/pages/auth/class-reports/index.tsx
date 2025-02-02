import { GetServerSidePropsContext } from 'next';

// import ClassReportsTemplate from 'templates/ClassReports';

import { listClassrooms, classroomsKeys } from 'requests/queries/classrooms';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function ClassesReportsPage() {
  return <>teste</>;

  // return <ClassReportsTemplate />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const filters = {
      school_id: context.req.fullSession?.profile.school?.id,
      employee_id: context.req.fullSession?.user.employee?.id,
      page: 1,
      size: 20
    };

    const dehydratedState = await prefetchQuery([
      {
        key: classroomsKeys.list(JSON.stringify(filters)),
        fetcher: () => listClassrooms(filters, context.req.session)
      }
    ]);

    return {
      props: {
        dehydratedState
      }
    };
  }
);

export default ClassesReportsPage;
