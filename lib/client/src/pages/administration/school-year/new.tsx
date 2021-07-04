import { GetServerSidePropsContext } from 'next';

import NewSchoolYear from 'templates/Administration/SchoolYear/NewSchoolYear';

import { getStoredInitalState } from 'hooks/AtomProvider';
import protectedRoutes from 'utils/protected-routes';

function NewSchoolYearPage() {
  return <NewSchoolYear />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);
  const initialState = getStoredInitalState(context);

  return {
    props: {
      session,
      initialState
    }
  };
}

NewSchoolYearPage.auth = {
  module: 'SCHOOL_YEAR'
};

export default NewSchoolYearPage;
