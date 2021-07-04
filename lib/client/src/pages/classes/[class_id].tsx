import { GetServerSidePropsContext } from 'next';

import ClassTemplate from 'templates/Class';

import { listAttendances } from 'requests/queries/attendances';
import { listClasses, showClass } from 'requests/queries/class';
import { listEnrolls } from 'requests/queries/enrolls';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

function ClassPage() {
  return <ClassTemplate />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const { class_id } = context.params!;

  const classEntity = await showClass(session, class_id as string);

  const attendancesFilter = {
    class_id: 'all',
    classroom_id: classEntity?.classroom_id
  };

  const listClassesFilter = {
    classroom_id: classEntity?.classroom_id,
    school_subject_id: classEntity?.school_subject_id
  };

  const listEnrollsFilter = {
    classroom_id: classEntity?.classroom_id,
    school_id: classEntity?.classroom.school_id
  };

  const dehydratedState = await prefetchQuery([
    {
      key: `show-class-${class_id}`,
      fetcher: () => classEntity
    },
    {
      key: `list-attendances-${JSON.stringify(attendancesFilter)}`,
      fetcher: () => listAttendances(session, attendancesFilter)
    },
    {
      key: `list-classes-${JSON.stringify(listClassesFilter)}`,
      fetcher: () => listClasses(session, listClassesFilter)
    },
    {
      key: `list-enrolls-${JSON.stringify(listEnrollsFilter)}`,
      fetcher: () => listEnrolls(session, listEnrollsFilter)
    }
  ]);

  return {
    props: {
      session,
      dehydratedState
    }
  };
}

ClassPage.auth = {
  module: 'CLASS'
};

export default ClassPage;
