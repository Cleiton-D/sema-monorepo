import { GetServerSidePropsContext } from 'next';

import MunicipalSecretary from 'templates/Administration/MunicipalSecretary';

import { showBranch } from 'requests/queries/branch';

import prefetchQuery from 'utils/prefetch-query';
import { listEmployees, showEmployee } from 'requests/queries/employee';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function MunicipalSecretaryPage() {
  return <MunicipalSecretary />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const branch = await showBranch(
      { type: 'MUNICIPAL_SECRETARY' },
      context.req.session
    );

    const dehydratedState = await prefetchQuery([
      {
        key: `show-branch-${JSON.stringify({ type: 'MUNICIPAL_SECRETARY' })}`,
        fetcher: () => branch
      },
      {
        key: `show-employee-${JSON.stringify({
          branch_id: branch?.id,
          accessCode: 'municipal-secretary'
        })}`,
        fetcher: () =>
          showEmployee(
            {
              branch_id: branch?.id,
              accessCode: 'municipal-secretary'
            },
            context.req.session
          )
      },
      {
        key: `list-employees-${JSON.stringify({
          accessCode: 'pedagogical-coordination',
          branch_id: branch?.id
        })}`,
        fetcher: () =>
          listEmployees(
            {
              accessCode: 'pedagogical-coordination',
              branch_id: branch?.id
            },
            context.req.session
          )
      },
      {
        key: `list-employees-${JSON.stringify({
          accessCode: 'bookkeeping',
          branch_id: branch?.id
        })}`,
        fetcher: () =>
          listEmployees(
            {
              accessCode: 'bookkeeping',
              branch_id: branch?.id
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

MunicipalSecretaryPage.auth = {
  module: 'MUNICIPAL_SECRETARY'
};

export default MunicipalSecretaryPage;
