import { GetServerSidePropsContext } from 'next';

import NewMultigradeTemplate from 'templates/Multigrades/New';

import { classroomsKeys, listClassrooms } from 'requests/queries/classrooms';
import { getSchool, schoolKeys } from 'requests/queries/schools';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function NewMultigradePage() {
  return <NewMultigradeTemplate type="new" />;
}

const getData = async (id: string, session?: AppSession) => {
  const school = await getSchool({ id }, session);

  const filters = {
    school_id: school.id
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

NewMultigradePage.auth = {
  module: 'CLASSROOM',
  rule: 'WRITE'
};

export default NewMultigradePage;
