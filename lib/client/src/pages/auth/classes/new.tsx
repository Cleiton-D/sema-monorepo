import { GetServerSidePropsContext } from 'next';

import NewClass from 'templates/Classes/NewClass';

import { showSchoolSubject } from 'requests/queries/school-subjects';
import { showClassroom } from 'requests/queries/classrooms';
import { showSchoolYear } from 'requests/queries/school-year';
import {
  calendarEventsKeys,
  listCalendarEvents,
  ListCalendarEventsFilters
} from 'requests/queries/calendar-events';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

function NewClassPage() {
  return <NewClass />;
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

NewClassPage.auth = {
  module: 'CLASS',
  rule: 'WRITE'
};

export default NewClassPage;
