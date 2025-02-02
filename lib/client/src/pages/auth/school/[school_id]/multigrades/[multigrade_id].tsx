import { GetServerSidePropsContext } from 'next';

import NewMultigradeTemplate from 'templates/Multigrades/New';

import {
  listClassPeriods,
  classPeriodsKeys
} from 'requests/queries/class-periods';
import { multigradesKeys, showMultigrade } from 'requests/queries/multigrades';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function EditMultigradePage() {
  return <NewMultigradeTemplate type="update" />;
}

const getData = async (
  context: GetServerSidePropsContext,
  schoolId: string,
  multigradeId: string
) => {
  const multigradeFilters = { multigrade_id: multigradeId };

  return prefetchQuery([
    {
      key: classPeriodsKeys.list(
        JSON.stringify({
          school_year_id: context.req.fullSession?.schoolYear.id
        })
      ),
      fetcher: () =>
        listClassPeriods(
          {
            school_year_id: context.req.fullSession?.schoolYear.id
          },
          context.req.session
        )
    },
    {
      key: multigradesKeys.show(JSON.stringify(multigradeFilters)),
      fetcher: () => showMultigrade(multigradeFilters, context.req.session)
    }
  ]);
};

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const { school_id, multigrade_id } = context.params!;
    const schoolId = (() => {
      if (school_id === 'me') {
        return context.req.fullSession?.profile.school?.id;
      }
      return school_id;
    })();

    const dehydratedState = await getData(
      context,
      schoolId as string,
      multigrade_id as string
    );

    return {
      props: {
        dehydratedState
      }
    };
  }
);

EditMultigradePage.auth = {
  module: 'CLASSROOM',
  rule: 'WRITE'
};

export default EditMultigradePage;
