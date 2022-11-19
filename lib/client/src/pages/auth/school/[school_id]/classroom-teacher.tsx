import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';

import ClassroomTeacher from 'templates/ClassroomTeacher';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

import { classroomsKeys, listClassrooms } from 'requests/queries/classrooms';
import { getSchool, schoolKeys } from 'requests/queries/schools';

function ClassroomTeacherPage() {
  return <ClassroomTeacher />;
}

const getData = async (session: Session | null, id: string) => {
  const school = await getSchool(session, { id });

  const filters = {
    school_id: school.id,
    page: 1,
    size: 20
  };

  return prefetchQuery([
    {
      key: classroomsKeys.list(JSON.stringify(filters)),
      fetcher: () => listClassrooms(session, filters)
    },
    {
      key: schoolKeys.show(JSON.stringify({ id: id })),
      fetcher: () => school
    }
  ]);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const { school_id } = context.params!;
  if (school_id === 'me') {
    if (session?.schoolId) {
      const dehydratedState = await getData(session, session?.schoolId);
      return {
        props: {
          session,
          dehydratedState
        }
      };
    }

    return {
      props: {
        session
      }
    };
  }

  const dehydratedState = await getData(session, school_id as string);

  return {
    props: {
      session,
      dehydratedState
    }
  };
}

ClassroomTeacherPage.auth = {
  module: 'CLASSROOM_TEACHER'
};

export default ClassroomTeacherPage;
