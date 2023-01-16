import { GetServerSidePropsContext } from 'next';

import Multigrades from 'templates/Multigrades';

import {
  listClassPeriods,
  classPeriodsKeys
} from 'requests/queries/class-periods';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

function MultigradesPage() {
  return <Multigrades />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const dehydratedState = await prefetchQuery([
    {
      key: classPeriodsKeys.list(
        JSON.stringify({
          school_year_id: session?.configs.school_year_id
        })
      ),
      fetcher: () =>
        listClassPeriods(session, {
          school_year_id: session?.configs.school_year_id
        })
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
