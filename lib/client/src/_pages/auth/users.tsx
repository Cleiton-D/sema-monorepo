import { GetServerSidePropsContext } from 'next';

// import Users from 'templates/Users';

import prefetchQuery from 'utils/prefetch-query';
import { listUsers } from 'requests/queries/users';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function UsersPage() {
  return <>teste</>;

  // return <Users />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const dehydratedState = await prefetchQuery({
      key: 'get-users',
      fetcher: () => listUsers(context.req.session)
    });

    return { props: { dehydratedState } };
  }
);

UsersPage.auth = {
  module: 'USER'
};

export default UsersPage;
