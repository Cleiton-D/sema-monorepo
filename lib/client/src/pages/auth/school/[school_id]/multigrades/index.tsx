import { GetServerSidePropsContext } from 'next';

import Multigrades from 'templates/Multigrades';

import { listClassPeriods, queryKeys } from 'requests/queries/class-periods';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

function MultigradesPage() {
  return <Multigrades />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const dehydratedState = await prefetchQuery([
    {
      key: queryKeys.LIST_CLASS_PERIODS,
      fetcher: () => listClassPeriods(session)
    }
  ]);

  return {
    props: {
      session,
      dehydratedState
    }
  };
}

MultigradesPage.auth = {
  module: 'CLASSROOM'
};

export default MultigradesPage;
