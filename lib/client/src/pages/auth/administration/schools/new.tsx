import { GetServerSidePropsContext } from 'next';
import NewSchool from 'templates/Administration/Schools/NewSchool';

import protectedRoutes from 'utils/protected-routes';

function NewSchoolPage() {
  return <NewSchool />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  return {
    props: {
      session
    }
  };
}

NewSchoolPage.auth = {
  module: 'SCHOOL',
  rule: 'WRITE'
};

export default NewSchoolPage;
