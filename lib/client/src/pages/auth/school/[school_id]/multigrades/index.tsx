import { GetServerSidePropsContext } from 'next';

import Multigrades from 'templates/Multigrades';

import {
  listClassPeriods,
  classPeriodsKeys
} from 'requests/queries/class-periods';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function MultigradesPage() {
  return <Multigrades />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const dehydratedState = await prefetchQuery([
      {
        key: classPeriodsKeys.list(
          JSON.stringify({
            school_year_id: context.req.fullSession?.schoolYear.id
          })
        ),
        fetcher: () =>
          listClassPeriods(
            {
              school_year_id: context.req.fullSession?.schoolYear.id
            },
            context.req.session
          )
      }
    ]);

    return {
      props: {
        dehydratedState
      }
    };
  }
);

MultigradesPage.auth = {
  module: 'CLASSROOM'
};

export default MultigradesPage;
