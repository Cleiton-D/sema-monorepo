import { GetServerSidePropsContext } from 'next';

import SchoolSubject from 'templates/Administration/SchoolSubjects';

import { listSchoolSubjects } from 'requests/queries/school-subjects';

import { withAccess } from 'hooks/AccessProvider';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

const SchoolSubjectPage = () => {
  return <SchoolSubject />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const { queryKey, modules } = await withAccess(context, session, {
    module: 'SCHOOL-SUBJECT'
  });

  const dehydratedState = await prefetchQuery([
    {
      key: 'get-school-subjects',
      fetcher: () => listSchoolSubjects(session)
    },
    {
      key: queryKey,
      fetcher: () => modules
    }
  ]);

  return {
    props: {
      session,
      dehydratedState
    }
  };
}

SchoolSubjectPage.auth = {
  module: 'SCHOOL-SUBJECT'
};

export default SchoolSubjectPage;
