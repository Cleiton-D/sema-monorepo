import { GetServerSidePropsContext } from 'next';

import Classrooms, { ClassroomsProps } from 'templates/Classrooms';

import { listClassrooms } from 'requests/queries/classrooms';
import { getSchool } from 'requests/queries/schools';

import protectedRoutes from 'utils/protected-routes';
import prefetchQuery from 'utils/prefetch-query';

function ClassroomsPage(props: ClassroomsProps) {
  return <Classrooms {...props} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const { school_id } = context.params!;

  const school = await getSchool(session, { id: school_id as string });

  const filters = {
    school_id: school.id
  };

  const dehydratedState = await prefetchQuery({
    key: `list-classrooms-${JSON.stringify(filters)}`,
    fetcher: () => listClassrooms(session, filters)
  });

  return {
    props: {
      session,
      dehydratedState,
      school
    }
  };
}

ClassroomsPage.auth = {
  module: 'CLASSROOM'
};

export default ClassroomsPage;
