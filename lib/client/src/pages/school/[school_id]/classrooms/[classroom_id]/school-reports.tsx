import { GetServerSidePropsContext } from 'next';

import SchoolReportsTemplate from 'templates/SchoolReports';

import { showClassroom } from 'requests/queries/classrooms';
import { listSchoolReports } from 'requests/queries/school-reports';
import { showSchoolSubject } from 'requests/queries/school-subjects';
import { listSchoolTermPeriods } from 'requests/queries/school-term-periods';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

function SchoolReportsPage() {
  return <SchoolReportsTemplate />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const { query } = context;

  const dehydratedState = await prefetchQuery([
    {
      key: `show-classroom-${JSON.stringify({
        id: query.classroom_id as string
      })}`,
      fetcher: () =>
        showClassroom(session, { id: query.classroom_id as string })
    },
    {
      key: `show-school-subject-${query.school_subject as string}`,
      fetcher: () => showSchoolSubject(session, query.school_subject as string)
    },
    {
      key: `list-school-reports-${JSON.stringify({
        classroom_id: query.classroom_id as string,
        school_subject_id: query.school_subject as string
      })}`,
      fetcher: () =>
        listSchoolReports(session, {
          classroom_id: query.classroom_id as string,
          school_subject_id: query.school_subject as string
        })
    },
    {
      key: `list-school-term-periods-${JSON.stringify({
        school_year_id: session?.configs.school_year_id
      })}`,
      fetcher: () =>
        listSchoolTermPeriods(session, {
          school_year_id: session?.configs.school_year_id
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

SchoolReportsPage.auth = {
  module: 'SCHOOL_REPORT'
};

export default SchoolReportsPage;
