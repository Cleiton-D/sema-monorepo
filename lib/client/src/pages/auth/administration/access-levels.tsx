import { GetServerSidePropsContext } from 'next';

import AccessLevels from 'templates/Administration/AccessLevels';

import { listAccessLevels } from 'requests/queries/access-levels';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function AccessLevelPage() {
  return <AccessLevels />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const dehydratedState = await prefetchQuery({
      key: 'get-access-levels',
      fetcher: () => listAccessLevels(context.req.session)
    });

    return {
      props: {
        dehydratedState
      }
    };
  }
);

AccessLevelPage.auth = {
  module: 'ACCESS_LEVEL'
};

export default AccessLevelPage;
