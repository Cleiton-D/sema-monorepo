import { GetServerSidePropsContext } from 'next';

import NewEmployee from 'templates/Administration/Employees/New';

import protectedRoutes from 'utils/protected-routes';

export default function NewEmployeePage() {
  return <NewEmployee />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  return {
    props: {
      session
    }
  };
}
