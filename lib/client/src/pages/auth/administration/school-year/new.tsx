import { GetServerSidePropsContext } from 'next';

// import NewSchoolYear from 'templates/Administration/SchoolYear/NewSchoolYear';

import { getStoredInitalState } from 'hooks/AtomProvider';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function NewSchoolYearPage() {
  return <>teste</>;

  // return <NewSchoolYear />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const initialState = getStoredInitalState(context);

    return {
      props: {
        initialState
      }
    };
  }
);

NewSchoolYearPage.auth = {
  module: 'SCHOOL_YEAR',
  rule: 'WRITE'
};

export default NewSchoolYearPage;
