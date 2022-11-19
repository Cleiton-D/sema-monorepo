import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';

import TeacherSchoolSubjects from 'templates/TeacherSchoolSubjects';

import { getSchool, schoolKeys } from 'requests/queries/schools';

import protectedRoutes from 'utils/protected-routes';
import prefetchQuery from 'utils/prefetch-query';

function TeacherSchoolSubjectsPage() {
  return <TeacherSchoolSubjects />;
}

const getData = async (session: Session | null, id: string) => {
  const school = await getSchool(session, { id });

  return prefetchQuery([
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

TeacherSchoolSubjectsPage.auth = {
  module: 'TEACHER_SCHOOL_SUBJECT'
};

export default TeacherSchoolSubjectsPage;
