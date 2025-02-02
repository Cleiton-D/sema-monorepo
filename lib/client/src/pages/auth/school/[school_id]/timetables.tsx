import { GetServerSidePropsContext } from 'next';

import Timetables from 'templates/Timetables';

import { getSchool, schoolKeys } from 'requests/queries/schools';
import { classroomsKeys, listClassrooms } from 'requests/queries/classrooms';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function TimetablesPage() {
  return <Timetables />;
}

const getData = async (id: string, session?: AppSession) => {
  const school = await getSchool({ id }, session);

  const filters = {
    school_id: school.id,
    with_in_multigrades: false,
    with_multigrades: true,
    page: 1,
    size: 20
  };

  return prefetchQuery([
    {
      key: classroomsKeys.list(JSON.stringify(filters)),
      fetcher: () => listClassrooms(filters, session)
    },
    {
      key: schoolKeys.show(JSON.stringify({ id: id })),
      fetcher: () => school
    }
  ]);
};

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const { school_id } = context.params!;
    if (school_id === 'me') {
      if (context.req.fullSession?.profile.school?.id) {
        const dehydratedState = await getData(
          context.req.fullSession?.profile.school?.id,
          context.req.session
        );
        return {
          props: {
            dehydratedState
          }
        };
      }

      return {
        props: {} as any
      };
    }

    const dehydratedState = await getData(
      school_id as string,
      context.req.session
    );

    return {
      props: {
        dehydratedState
      }
    };
  }
);

TimetablesPage.auth = {
  module: 'SCHOOL'
};

export default TimetablesPage;
