import { GetServerSidePropsContext } from 'next';

// import SchoolSubject from 'templates/Administration/SchoolSubjects';

import { listSchoolSubjects } from 'requests/queries/school-subjects';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

const SchoolSubjectPage = () => {
  return <>teste</>;

  // return <SchoolSubject />;
};

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const dehydratedState = await prefetchQuery([
      {
        key: 'get-school-subjects',
        fetcher: () =>
          listSchoolSubjects(
            {
              school_year_id: context.req.fullSession?.schoolYear.id
            },
            context.req.session
          )
      }
    ]);

    return {
      props: {
        dehydratedState
      }
    };
  }
);

SchoolSubjectPage.auth = {
  module: 'SCHOOL-SUBJECT'
};

export default SchoolSubjectPage;
