import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';

import Enrolls from 'templates/Enrolls';

import { listEnrolls, enrollsKeys } from 'requests/queries/enrolls';
import { getSchool, schoolKeys } from 'requests/queries/schools';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

function EnrollsPage() {
  return <Enrolls />;
}

const getData = async (session: Session | null, id?: string) => {
  const school = id ? await getSchool(session, { id }) : null;

  const filters = {
    school_id: school?.id,
    school_year_id: session?.configs.school_year_id,
    page: 1,
    size: 20
  };

  return prefetchQuery([
    {
      key: enrollsKeys.list(JSON.stringify(filters)),
      fetcher: () => listEnrolls(session, filters)
    },
    {
      key: schoolKeys.show(JSON.stringify({ id: id })),
      fetcher: () => school
    }
  ]);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const { school_id } = context.query || {};
  if (school_id === 'me') {
    if (session?.schoolId) {
      const dehydratedState = await getData(session, session?.schoolId);
      return {
        props: {
          session,
          dehydratedState
        }
      };
    }

    return {
      props: {
        session
      }
    };
  }

  const dehydratedState = await getData(session, school_id as string);

  return {
    props: {
      session,
      dehydratedState
    }
  };
}

EnrollsPage.auth = {
  module: 'ENROLL'
};

export default EnrollsPage;
