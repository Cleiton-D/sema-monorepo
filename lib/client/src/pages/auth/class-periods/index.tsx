import { GetServerSidePropsContext } from 'next';

// import ClassPeriods from 'templates/ClassPeriods';
import prefetchQuery from 'utils/prefetch-query';
import { listClassPeriods } from 'requests/queries/class-periods';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function ClassPeriodsPage() {
  return <>teste</>;

  // return <ClassPeriods />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const dehydratedState = await prefetchQuery({
      key: 'get-class-periods',
      fetcher: () =>
        listClassPeriods(
          {
            school_year_id: context.req.fullSession?.schoolYear.id
          },
          context.req.session
        )
    });

    return {
      props: {
        dehydratedState
      }
    };
  }
);

ClassPeriodsPage.auth = {
  module: 'MUNICIPAL_SECRETARY'
};

export default ClassPeriodsPage;
