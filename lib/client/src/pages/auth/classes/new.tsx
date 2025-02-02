import { GetServerSidePropsContext } from 'next';

import NewClass from 'templates/Classes/NewClass';

import {
  calendarEventsKeys,
  listCalendarEvents,
  ListCalendarEventsFilters
} from 'requests/queries/calendar-events';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function NewClassPage() {
  return <NewClass />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    let dehydratedState;
    const schoolYear = context.req.fullSession?.schoolYear;
    const schoolYearFetcher = {
      key: 'show-school-year',
      fetcher: () => schoolYear
    };

    if (schoolYear?.status !== 'ACTIVE') {
      return {
        redirect: {
          destination: '/auth/classes',
          permanent: false
        }
      };
    }

    if (!schoolYear) {
      dehydratedState = await prefetchQuery([schoolYearFetcher]);
    } else {
      const filters: ListCalendarEventsFilters = {
        school_year_id: schoolYear.id,
        competence: context.req.fullSession?.profile.school?.id
          ? 'ALL'
          : 'MUNICIPAL',
        school_id: context.req.fullSession?.profile.school?.id
      };

      dehydratedState = await prefetchQuery([
        schoolYearFetcher,
        {
          key: calendarEventsKeys.list(JSON.stringify(filters)),
          fetcher: () => listCalendarEvents(filters, context.req.session)
        }
      ]);
    }
    return {
      props: {
        dehydratedState
      }
    };
  }
);

NewClassPage.auth = {
  module: 'CLASS',
  rule: 'WRITE'
};

export default NewClassPage;
