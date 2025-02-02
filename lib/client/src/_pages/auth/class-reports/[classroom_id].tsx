import { GetServerSidePropsContext } from 'next';

// import ClassroomClassReportTemplate from 'templates/ClassroomClassReportPage';

import { listSchoolTermPeriods } from 'requests/queries/school-term-periods';
import { classroomsKeys, showClassroom } from 'requests/queries/classrooms';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

const ClassroomClassReportPage = () => {
  return <>teste</>;

  // return <ClassroomClassReportTemplate />;
};

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const classroom_id = context.params!.classroom_id;

    const dehydratedState = await prefetchQuery([
      {
        key: `list-school-term-periods-${JSON.stringify({
          school_year_id: context.req.fullSession?.schoolYear.id
        })}`,
        fetcher: () =>
          listSchoolTermPeriods(
            {
              school_year_id: context.req.fullSession?.schoolYear.id
            },
            context.req.session
          )
      },
      {
        key: classroomsKeys.show(JSON.stringify({ id: classroom_id })),
        fetcher: () =>
          showClassroom({ id: classroom_id as string }, context.req.session)
      }
    ]);

    return {
      props: {
        dehydratedState
      }
    };
  }
);

export default ClassroomClassReportPage;
