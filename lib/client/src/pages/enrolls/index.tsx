import { GetServerSidePropsContext } from 'next';

import Enrolls, { EnrollsProps } from 'templates/Enrolls';

import { listEnrolls } from 'requests/queries/enrolls';
import { getSchool } from 'requests/queries/schools';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

function EnrollsPage(props: EnrollsProps) {
  return <Enrolls {...props} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const { school_id } = context.query || {};

  const school = school_id
    ? await getSchool(session, { id: school_id as string })
    : null;

  const filters = {
    school_id: school?.id
  };

  const dehydratedState = await prefetchQuery({
    key: `list-enrolls-${JSON.stringify(filters)}`,
    fetcher: () => listEnrolls(session, filters)
  });

  return {
    props: {
      session,
      dehydratedState,
      school
    }
  };
}

EnrollsPage.auth = {
  module: 'ENROLL'
};

export default EnrollsPage;
