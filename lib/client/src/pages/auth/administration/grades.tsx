import { GetServerSidePropsContext } from 'next';

// import Grades from 'templates/Administration/Grades';

import { gradesKeys, listGrades } from 'requests/queries/grades';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function GradePage() {
  return <>teste</>;

  // return <Grades />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const dehydratedState = await prefetchQuery({
      key: gradesKeys.list(
        JSON.stringify({
          school_year_id: context.req.fullSession?.schoolYear.id
        })
      ),
      fetcher: () =>
        listGrades({ school_year_id: context.req.fullSession?.schoolYear.id })
    });

    return {
      props: {
        dehydratedState
      }
    };
  }
);

GradePage.auth = {
  module: 'GRADE'
};

export default GradePage;
