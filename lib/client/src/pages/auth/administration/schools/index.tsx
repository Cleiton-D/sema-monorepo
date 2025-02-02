import { GetServerSidePropsContext } from 'next';

// import Schools from 'templates/Administration/Schools';

import { listSchools } from 'requests/queries/schools';
import prefetchQuery from 'utils/prefetch-query';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function SchoolsPage() {
  return <>teste</>;

  // return <Schools />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const dehydratedState = await prefetchQuery({
      key: 'get-schools',
      fetcher: () => listSchools(context.req.session)
    });

    return {
      props: {
        dehydratedState
      }
    };
  }
);

SchoolsPage.auth = {
  module: 'SCHOOL'
};

export default SchoolsPage;
