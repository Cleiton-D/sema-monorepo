import { GetServerSidePropsContext } from 'next';

// import ClassroomTeacher from 'templates/ClassroomTeacher';

import prefetchQuery from 'utils/prefetch-query';

import { classroomsKeys, listClassrooms } from 'requests/queries/classrooms';
import { getSchool, schoolKeys } from 'requests/queries/schools';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function ClassroomTeacherPage() {
  return <>teste</>;

  // return <ClassroomTeacher />;
}

const getData = async (id: string, session?: AppSession) => {
  const school = await getSchool({ id }, session);

  const filters = {
    school_id: school.id,
    page: 1,
    size: 20
  };

  return prefetchQuery([
    {
      key: classroomsKeys.list(JSON.stringify(filters)),
      fetcher: () => listClassrooms(filters, session)
    },
    {
      key: schoolKeys.show(JSON.stringify({ id: id })),
      fetcher: () => school
    }
  ]);
};

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const { school_id } = context.params!;
    if (school_id === 'me') {
      if (context.req.fullSession?.profile.school?.id) {
        const dehydratedState = await getData(
          context.req.fullSession?.profile.school?.id,
          context.req.session
        );
        return {
          props: {
            dehydratedState
          }
        };
      }

      return {
        props: {} as any
      };
    }

    const dehydratedState = await getData(
      school_id as string,
      context.req.session
    );

    return {
      props: {
        dehydratedState
      }
    };
  }
);
ClassroomTeacherPage.auth = {
  module: 'CLASSROOM_TEACHER'
};

export default ClassroomTeacherPage;
