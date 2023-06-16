import { GetServerSidePropsContext } from 'next';

import EditClassTemplate from 'templates/EditClass';

import {
  listAttendancesByClasses,
  ListAttendancesByClassesFilters
} from 'requests/queries/attendances';
import { showClass, classesKeys } from 'requests/queries/class';
import {
  enrollClassroomsKeys,
  listEnrollClassrooms
} from 'requests/queries/enroll-classrooms';

import prefetchQuery from 'utils/prefetch-query';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function EditClassPage() {
  return <EditClassTemplate />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const { class_id } = context.params!;

    const classEntity = await showClass(
      class_id as string,
      context.req.session
    );

    const attendancesFilter: ListAttendancesByClassesFilters = {
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
        key: `list-attendances-by-classes-${JSON.stringify(attendancesFilter)}`,
        fetcher: () =>
          listAttendancesByClasses(attendancesFilter, context.req.session)
      },
      {
        key: enrollClassroomsKeys.list(JSON.stringify(listEnrollsFilter)),
        fetcher: () =>
          listEnrollClassrooms(listEnrollsFilter, context.req.session)
      }
    ]);

    return {
      props: {
        dehydratedState
      }
    };
  }
);

EditClassPage.auth = {
  module: 'CLASS',
  rule: 'WRITE'
};

export default EditClassPage;
