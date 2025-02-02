import { GetServerSidePropsContext } from 'next';
// import CalendarTemplate from 'templates/Calendar';

import { showSchoolYear } from 'requests/queries/school-year';
import {
  calendarEventsKeys,
  listCalendarEvents,
  ListCalendarEventsFilters
} from 'requests/queries/calendar-events';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function CalendarPage() {
  return <>teste</>;

  // return <CalendarTemplate />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    let dehydratedState;
    const schoolYear = await showSchoolYear(
      {
        id: context.req.fullSession?.schoolYear.id
      },
      context.req.session
    );
    const schoolYearFetcher = {
      key: 'show-school-year',
      fetcher: () => schoolYear
    };

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

CalendarPage.auth = {
  module: 'CALENDAR',
  rule: 'READ'
};

export default CalendarPage;
