import { GetServerSidePropsContext } from 'next';

import Grades from 'templates/Administration/Grades';

import { gradesKeys, listGrades } from 'requests/queries/grades';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

function GradePage() {
  return <Grades />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const dehydratedState = await prefetchQuery({
    key: gradesKeys.list(
      JSON.stringify({ school_year_id: session?.configs.school_year_id })
    ),
    fetcher: () =>
      listGrades(session, { school_year_id: session?.configs.school_year_id })
  });

  return {
    props: {
      session,
      dehydratedState
    }
  };
}

GradePage.auth = {
  module: 'GRADE'
};

export default GradePage;
