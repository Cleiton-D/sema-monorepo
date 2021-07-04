import { GetServerSidePropsContext } from 'next';

import MunicipalSecretary from 'templates/Administration/MunicipalSecretary';

import { showBranch } from 'requests/queries/branch';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';
import { listEmployees, showEmployee } from 'requests/queries/employee';

function MunicipalSecretaryPage() {
  return <MunicipalSecretary />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const branch = await showBranch(session, { type: 'MUNICIPAL_SECRETARY' });

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
        showEmployee(session, {
          branch_id: branch?.id,
          accessCode: 'municipal-secretary'
        })
    },
    {
      key: `list-employees-${JSON.stringify({
        accessCode: 'pedagogical-coordination',
        branch_id: branch?.id
      })}`,
      fetcher: () =>
        listEmployees(session, {
          accessCode: 'pedagogical-coordination',
          branch_id: branch?.id
        })
    },
    {
      key: `list-employees-${JSON.stringify({
        accessCode: 'bookkeeping',
        branch_id: branch?.id
      })}`,
      fetcher: () =>
        listEmployees(session, {
          accessCode: 'bookkeeping',
          branch_id: branch?.id
        })
    }
  ]);

  return {
    props: {
      session,
      dehydratedState
    }
  };
}

MunicipalSecretaryPage.auth = {
  module: 'MUNICIPAL_SECRETARY'
};

export default MunicipalSecretaryPage;
