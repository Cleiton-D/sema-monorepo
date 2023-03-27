import { GetServerSidePropsContext } from 'next';
import CalendarTemplate from 'templates/Calendar';

import { showSchoolYear } from 'requests/queries/school-year';
import {
  calendarEventsKeys,
  listCalendarEvents,
  ListCalendarEventsFilters
} from 'requests/queries/calendar-events';

import protectedRoutes from 'utils/protected-routes';
import prefetchQuery from 'utils/prefetch-query';

function CalendarPage() {
  return <CalendarTemplate />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  let dehydratedState;
  const schoolYear = await showSchoolYear(session, {
    id: session?.configs.school_year_id
  });
  const schoolYearFetcher = {
    key: 'show-school-year',
    fetcher: () => schoolYear
  };

  if (!schoolYear) {
    dehydratedState = await prefetchQuery([schoolYearFetcher]);
  } else {
    const filters: ListCalendarEventsFilters = {
      school_year_id: schoolYear.id,
      competence: session?.schoolId ? 'ALL' : 'MUNICIPAL',
      school_id: session?.schoolId
    };

    dehydratedState = await prefetchQuery([
      schoolYearFetcher,
      {
        key: calendarEventsKeys.list(JSON.stringify(filters)),
        fetcher: () => listCalendarEvents(session, filters)
      }
    ]);
  }

  return {
    props: {
      session,
      dehydratedState
    }
  };
}

CalendarPage.auth = {
  module: 'CALENDAR',
  rule: 'READ'
};

export default CalendarPage;
