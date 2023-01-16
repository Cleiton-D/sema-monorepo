import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';

import NewMultigradeTemplate from 'templates/Multigrades/New';

import {
  listClassPeriods,
  classPeriodsKeys
} from 'requests/queries/class-periods';
import { multigradesKeys, showMultigrade } from 'requests/queries/multigrades';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

function EditMultigradePage() {
  return <NewMultigradeTemplate type="update" />;
}

const getData = async (
  session: Session | null,
  schoolId: string,
  multigradeId: string
) => {
  const multigradeFilters = { multigrade_id: multigradeId };

  return prefetchQuery([
    {
      key: classPeriodsKeys.list(
        JSON.stringify({
          school_year_id: session?.configs.school_year_id
        })
      ),
      fetcher: () =>
        listClassPeriods(session, {
          school_year_id: session?.configs.school_year_id
        })
    },
    {
      key: multigradesKeys.show(JSON.stringify(multigradeFilters)),
      fetcher: () => showMultigrade(multigradeFilters, session)
    }
  ]);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const { school_id, multigrade_id } = context.params!;
  const schoolId = (() => {
    if (school_id === 'me') {
      return session?.schoolId;
    }
    return school_id;
  })();

  const dehydratedState = await getData(
    session,
    schoolId as string,
    multigrade_id as string
  );

  return {
    props: {
      session,
      dehydratedState
    }
  };
}

EditMultigradePage.auth = {
  module: 'CLASSROOM',
  rule: 'WRITE'
};

export default EditMultigradePage;
