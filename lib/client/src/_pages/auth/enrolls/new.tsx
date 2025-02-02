import { GetServerSidePropsContext } from 'next';

// import NewEnroll, { NewEnrollProps } from 'templates/Enrolls/New';

import { getSchool } from 'requests/queries/schools';

import ufs from 'assets/data/uf.json';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

// function NewEnrollPage(props: NewEnrollProps) {
function NewEnrollPage() {
  return <>teste</>;

  // return <NewEnroll {...props} />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const { school_id } = context.query || {};

    const school = await getSchool(
      { id: school_id as string },
      context.req.session
    );

    return {
      props: {
        school,
        ufs
      }
    };
  }
);

NewEnrollPage.auth = {
  module: 'ENROLL',
  rule: 'WRITE'
};

export default NewEnrollPage;
