import { GetServerSidePropsContext } from 'next';

// import TeacherSchoolSubjects from 'templates/TeacherSchoolSubjects';

import { getSchool, schoolKeys } from 'requests/queries/schools';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function TeacherSchoolSubjectsPage() {
  return <>teste</>;

  // return <TeacherSchoolSubjects />;
}

const getData = async (id: string, session?: AppSession) => {
  const school = await getSchool({ id }, session);

  return prefetchQuery([
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

TeacherSchoolSubjectsPage.auth = {
  module: 'TEACHER_SCHOOL_SUBJECT'
};

export default TeacherSchoolSubjectsPage;
