import { GetServerSidePropsContext } from 'next';

import NewEmployee from 'templates/Administration/Employees/New';

import protectedRoutes from 'utils/protected-routes';

export default function EditEmployeePage() {
  return <NewEmployee />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  console.log('params', context.params);
  console.log('query', context.query);

  return {
    props: {
      session
    }
  };
}
