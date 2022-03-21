import { GetServerSidePropsContext } from 'next';

import AccessLevels from 'templates/Administration/AccessLevels';

import { listAccessLevels } from 'requests/queries/access-levels';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

function AccessLevelPage() {
  return <AccessLevels />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const dehydratedState = await prefetchQuery({
    key: 'get-access-levels',
    fetcher: () => listAccessLevels(session)
  });

  return {
    props: {
      session,
      dehydratedState
    }
  };
}

AccessLevelPage.auth = {
  module: 'ACCESS_LEVEL'
};

export default AccessLevelPage;
