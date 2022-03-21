import { GetServerSidePropsContext } from 'next';

import ClassesTemplate from 'templates/Classes';

import protectedRoutes from 'utils/protected-routes';

function ClassesPage() {
  return <ClassesTemplate />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  return {
    props: {
      session
    }
  };
}

ClassesPage.auth = {
  module: 'CLASS'
};

export default ClassesPage;
