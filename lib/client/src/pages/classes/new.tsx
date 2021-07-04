import { GetServerSidePropsContext } from 'next';

import NewClass from 'templates/Classes/NewClass';

import { showSchoolSubject } from 'requests/queries/school-subjects';
import { showClassroom } from 'requests/queries/classrooms';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

export default function NewClassPage() {
  return <NewClass />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const { classroom, school_subject } = context.query;

  const classroomFilters = {
    school_id: session?.schoolId,
    id: classroom as string
  };
  const dehydratedState = await prefetchQuery([
    {
      key: `show-school-subject-${school_subject}`,
      fetcher: () => showSchoolSubject(session, school_subject as string)
    },
    {
      key: `show-classroom-${JSON.stringify(classroomFilters)}`,
      fetcher: () => showClassroom(session, classroomFilters)
    }
  ]);

  return {
    props: {
      session,
      dehydratedState
    }
  };
}
