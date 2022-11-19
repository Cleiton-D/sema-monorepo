import { GetServerSidePropsContext } from 'next';

import ClassTemplate from 'templates/Class';

import {
  listAttendancesByClasses,
  ListAttendancesByClassesFilters
} from 'requests/queries/attendances';
import { classesKeys, showClass } from 'requests/queries/class';
import {
  enrollClassroomsKeys,
  listEnrollClassrooms
} from 'requests/queries/enroll-classrooms';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

function ClassPage() {
  return <ClassTemplate />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const { class_id } = context.params!;

  const classEntity = await showClass(session, class_id as string);

  const listAttendancesFilter: ListAttendancesByClassesFilters = {
    classroom_id: classEntity?.classroom_id,
    school_subject_id: classEntity?.school_subject_id,
    limit: 6,
    sortBy: 'date_start',
    order: 'DESC',
    before: classEntity?.id
  };

  const listEnrollsFilter = {
    classroom_id: classEntity?.classroom_id
  };

  const dehydratedState = await prefetchQuery([
    {
      key: classesKeys.show(JSON.stringify({ id: class_id })),
      fetcher: () => classEntity
    },
    {
      key: `list-attendances-by-classes-${JSON.stringify(
        listAttendancesFilter
      )}`,
      fetcher: () => listAttendancesByClasses(session, listAttendancesFilter)
    },
    {
      key: enrollClassroomsKeys.list(JSON.stringify(listEnrollsFilter)),
      fetcher: () => listEnrollClassrooms(session, listEnrollsFilter)
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
