import { GetServerSidePropsContext } from 'next';

import SchoolYear from 'templates/Administration/SchoolYear';

import { getSchoolYearWithSchoolTerms } from 'requests/queries/school-year';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function SchoolYearPage() {
  return <SchoolYear />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const dehydratedState = await prefetchQuery({
      key: 'show-school-year',
      fetcher: () =>
        getSchoolYearWithSchoolTerms(
          {
            id: context.req.fullSession?.schoolYear.id
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

SchoolYearPage.auth = {
  module: 'SCHOOL_YEAR'
};

export default SchoolYearPage;
