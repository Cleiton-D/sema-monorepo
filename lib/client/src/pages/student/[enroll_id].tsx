import { GetServerSidePropsContext } from 'next';

import StudentPageTemplate from 'templates/Student';

import { getEnrollDetails } from 'requests/queries/enrolls';
import { listSchoolReports } from 'requests/queries/school-reports';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

export default function StudentPage() {
  return <StudentPageTemplate />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const { enroll_id } = context.params!;

  const filters = {
    enroll_id: enroll_id as string
  };

  const dehydratedState = await prefetchQuery([
    {
      key: `get-enroll-${enroll_id}`,
      fetcher: () => getEnrollDetails(enroll_id as string, session)
    },
    {
      key: `list-school-reports-${JSON.stringify(filters)}`,
      fetcher: () => listSchoolReports(session, filters)
    }
  ]);

  return {
    props: {
      session,
      dehydratedState
    }
  };
}
