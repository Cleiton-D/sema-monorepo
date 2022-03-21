import { GetServerSidePropsContext } from 'next';

import Grades from 'templates/Administration/Grades';

import { listGrades } from 'requests/queries/grades';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

function GradePage() {
  return <Grades />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const dehydratedState = await prefetchQuery({
    key: 'get-grades',
    fetcher: () => listGrades(session)
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
