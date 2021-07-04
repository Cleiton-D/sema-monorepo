import { GetServerSidePropsContext } from 'next';

import Users from 'templates/Users';

import protectedRoutes from 'utils/protected-routes';
import prefetchQuery from 'utils/prefetch-query';
import { listUsers } from 'requests/queries/users';

function UsersPage() {
  return <Users />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const dehydratedState = await prefetchQuery({
    key: 'get-users',
    fetcher: () => listUsers(session)
  });

  return { props: { session, dehydratedState } };
}

UsersPage.auth = {
  module: 'USER'
};

export default UsersPage;
