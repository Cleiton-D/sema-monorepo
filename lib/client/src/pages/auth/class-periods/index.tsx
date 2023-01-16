import { GetServerSidePropsContext } from 'next';

import protectedRoutes from 'utils/protected-routes';

import ClassPeriods from 'templates/ClassPeriods';
import prefetchQuery from 'utils/prefetch-query';
import { listClassPeriods } from 'requests/queries/class-periods';

function ClassPeriodsPage() {
  return <ClassPeriods />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const dehydratedState = await prefetchQuery({
    key: 'get-class-periods',
    fetcher: () =>
      listClassPeriods(session, {
        school_year_id: session?.configs.school_year_id
      })
  });

  return {
    props: {
      session,
      dehydratedState
    }
  };
}

ClassPeriodsPage.auth = {
  module: 'MUNICIPAL_SECRETARY'
};

export default ClassPeriodsPage;
