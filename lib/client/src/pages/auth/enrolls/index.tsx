import { GetServerSidePropsContext } from 'next';

// import Enrolls from 'templates/Enrolls';

import { listEnrolls, enrollsKeys } from 'requests/queries/enrolls';
import { getSchool, schoolKeys } from 'requests/queries/schools';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function EnrollsPage() {
  return <>teste</>;

  // return <Enrolls />;
}

const getData = async (context: GetServerSidePropsContext, id?: string) => {
  const school = id ? await getSchool({ id }, context.req.session) : null;

  const filters = {
    school_id: school?.id,
    school_year_id: context.req.fullSession?.schoolYear.id,
    page: 1,
    size: 20
  };

  return prefetchQuery([
    {
      key: enrollsKeys.list(JSON.stringify(filters)),
      fetcher: () => listEnrolls(filters, context.req.session)
    },
    {
      key: schoolKeys.show(JSON.stringify({ id: id })),
      fetcher: () => school
    }
  ]);
};

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const { school_id } = context.query || {};
    if (school_id === 'me') {
      if (context.req.fullSession?.profile.school?.id) {
        const dehydratedState = await getData(
          context,
          context.req.fullSession?.profile.school?.id
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

    const dehydratedState = await getData(context, school_id as string);

    return {
      props: {
        dehydratedState
      }
    };
  }
);

EnrollsPage.auth = {
  module: 'ENROLL'
};

export default EnrollsPage;
