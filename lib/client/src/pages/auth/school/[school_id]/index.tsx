import { GetServerSidePropsContext } from 'next';

import SchoolPageTemplate, { SchoolProps } from 'templates/School';

import { getSchool, getSchoolDetail } from 'requests/queries/schools';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

function SchoolPage(props: SchoolProps) {
  return <SchoolPageTemplate {...props} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const { school_id } = context.params!;

  const school = await getSchool(session, { id: school_id as string });

  const dehydratedState = await prefetchQuery({
    key: `school_detail-${school.id}`,
    fetcher: () => getSchoolDetail(school.id, session)
  });

  return {
    props: {
      session,
      dehydratedState,
      school
    }
  };
}

SchoolPage.auth = {
  module: 'SCHOOL'
};

export default SchoolPage;
