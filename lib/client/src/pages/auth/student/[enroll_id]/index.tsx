import { GetServerSidePropsContext } from 'next';

import StudentPageTemplate from 'templates/Student';

import { getEnrollDetails } from 'requests/queries/enrolls';
import { listSchoolReports } from 'requests/queries/school-reports';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function StudentPage() {
  return <StudentPageTemplate />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const { enroll_id } = context.params!;

    const filters = {
      enroll_id: enroll_id as string
    };

    const dehydratedState = await prefetchQuery([
      {
        key: `get-enroll-${enroll_id}`,
        fetcher: () =>
          getEnrollDetails(enroll_id as string, context.req.session)
      },
      {
        key: `list-school-reports-${JSON.stringify(filters)}`,
        fetcher: () => listSchoolReports(filters, context.req.session)
      }
    ]);

    return {
      props: {
        dehydratedState
      }
    };
  }
);
StudentPage.auth = {
  module: 'ENROLL'
};

export default StudentPage;
