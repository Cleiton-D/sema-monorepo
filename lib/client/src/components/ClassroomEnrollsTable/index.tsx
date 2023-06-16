import { useMemo } from 'react';

import EnrollsTable from 'components/EnrollsTable';

import { Classroom } from 'models/Classroom';

import { useListEnrollClassrooms } from 'requests/queries/enroll-classrooms';

type ClassroomEnrollsTableProps = {
  classroom: Classroom;
};
const ClassroomEnrollsTable = ({
  classroom
}: ClassroomEnrollsTableProps): JSX.Element => {
  const { data: enrollClassrooms = [] } = useListEnrollClassrooms({
    classroom_id: classroom.id
  });

  const enrolls = useMemo(() => {
    return enrollClassrooms.map(({ enroll, status }) => ({
      ...enroll,
      status
    }));
  }, [enrollClassrooms]);

  return <EnrollsTable enrolls={enrolls} minimal />;
};

export default ClassroomEnrollsTable;
