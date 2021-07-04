import { GetServerSidePropsContext } from 'next';

import SchoolYear from 'templates/Administration/SchoolYear';

import { getSchoolYearWithSchoolTerms } from 'requests/queries/school-year';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

function SchoolYearPage() {
  return <SchoolYear />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const dehydratedState = await prefetchQuery({
    key: 'show-school-year',
    fetcher: () => getSchoolYearWithSchoolTerms(session)
  });

  return {
    props: {
      session,
      dehydratedState
    }
  };
}

SchoolYearPage.auth = {
  module: 'SCHOOL_YEAR'
};

export default SchoolYearPage;
