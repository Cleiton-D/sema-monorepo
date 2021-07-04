import { GetServerSidePropsContext } from 'next';

import Dashboard, { DashboardProps } from 'templates/Dashboard';

import { getSchoolYearWithSchoolTerms } from 'requests/queries/school-year';
import { enrollCount } from 'requests/queries/enrolls';
import { countSchools, getSchool } from 'requests/queries/schools';
import { gradesCount } from 'requests/queries/grades';
import { employeesCount } from 'requests/queries/employee';

import protectedRoutes from 'utils/protected-routes';
import prefetchQuery from 'utils/prefetch-query';
import { countClassrooms } from 'requests/queries/classrooms';
import { countSchoolTeachers } from 'requests/queries/school-teachers';

function DashboardPage(props: DashboardProps) {
  return <Dashboard {...props} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  console.log(session);
  const school =
    session?.branch.type !== 'MUNICIPAL_SECRETARY' &&
    session?.accessLevel?.code !== 'administrator'
      ? await getSchool(session, { id: 'me' })
      : null;

  // const queries =
  //   session?.branch.type === 'MUNICIPAL_SECRETARY'
  //     ? [
  //         {
  //           key: 'show-school-year',
  //           fetcher: () => getSchoolYearWithSchoolTerms(session)
  //         },
  //         {
  //           key: `enroll-count-${JSON.stringify({})}`,
  //           fetcher: () => enrollCount(session)
  //         },
  //         {
  //           key: 'count-schools',
  //           fetcher: () => countSchools(session)
  //         },
  //         {
  //           key: 'grades-count',
  //           fetcher: () => gradesCount(session)
  //         },
  //         {
  //           key: 'count-employees',
  //           fetcher: () => employeesCount(session)
  //         }
  //       ]
  //     : [
  //         {
  //           key: 'show-school-year',
  //           fetcher: () => getSchoolYearWithSchoolTerms(session)
  //         },
  //         {
  //           key: `enroll-count-${JSON.stringify({ school_id: school?.id })}`,
  //           fetcher: () => enrollCount(session, { school_id: school?.id })
  //         },
  //         {
  //           key: `count-classrooms-${JSON.stringify({
  //             school_id: school?.id
  //           })}`,
  //           fetcher: () => countClassrooms(session, { school_id: school?.id })
  //         },
  //         {
  //           key: `count-school-teachers-${JSON.stringify({
  //             school_id: school?.id
  //           })}`,
  //           fetcher: () =>
  //             countSchoolTeachers(session, { school_id: school?.id })
  //         }
  //       ];

  const dehydratedState = await prefetchQuery([]);

  return {
    props: {
      session,
      school,
      dehydratedState
    }
  };
}

DashboardPage.auth = {
  module: 'DASHBOARD'
};

export default DashboardPage;
