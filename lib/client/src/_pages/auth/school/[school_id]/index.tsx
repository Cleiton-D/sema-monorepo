import { GetServerSidePropsContext } from 'next';

// import SchoolPageTemplate, { SchoolProps } from 'templates/School';

import { getSchool, getSchoolDetail } from 'requests/queries/schools';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function SchoolPage(props: any) {
  return <>teste</>;

  // return <SchoolPageTemplate {...props} />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const { school_id } = context.params!;

    const school = await getSchool(
      { id: school_id as string },
      context.req.session
    );

    const dehydratedState = await prefetchQuery({
      key: `school_detail-${school.id}`,
      fetcher: () =>
        getSchoolDetail(
          school.id,
          context.req.fullSession?.schoolYear.id,
          context.req.session
        )
    });

    return {
      props: {
        dehydratedState,
        school
      }
    };
  }
);

SchoolPage.auth = {
  module: 'SCHOOL'
};

export default SchoolPage;
