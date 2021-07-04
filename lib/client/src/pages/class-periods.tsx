import { GetServerSidePropsContext } from 'next';

import protectedRoutes from 'utils/protected-routes';

import ClassPeriods from 'templates/ClassPeriods';
import prefetchQuery from 'utils/prefetch-query';
import { listClassPeriods } from 'requests/queries/class-periods';

export default function ClassPeriodsPage() {
  return <ClassPeriods />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const dehydratedState = await prefetchQuery({
    key: 'get-class-periods',
    fetcher: () => listClassPeriods(session)
  });

  return {
    props: {
      session,
      dehydratedState
    }
  };
}
