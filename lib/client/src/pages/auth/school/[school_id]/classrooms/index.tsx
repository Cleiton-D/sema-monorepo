import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';

import Classrooms from 'templates/Classrooms';

import { classroomsKeys, listClassrooms } from 'requests/queries/classrooms';
import { getSchool, schoolKeys } from 'requests/queries/schools';

import protectedRoutes from 'utils/protected-routes';
import prefetchQuery from 'utils/prefetch-query';

function ClassroomsPage() {
  return <Classrooms />;
}

const getData = async (session: Session | null, id: string) => {
  const school = await getSchool(session, { id });

  const filters = {
    school_id: school.id,
    page: 1,
    size: 20
  };

  return prefetchQuery([
    {
      key: classroomsKeys.list(JSON.stringify(filters)),
      fetcher: () => listClassrooms(session, filters)
    },
    {
      key: schoolKeys.show(JSON.stringify({ id: id })),
      fetcher: () => school
    }
  ]);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const { school_id } = context.params!;
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

ClassroomsPage.auth = {
  module: 'CLASSROOM'
};

export default ClassroomsPage;
