import { useMemo } from 'react';
import { useSession } from 'next-auth/react';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';

import { useCountAttendances } from 'requests/queries/attendances';
import { useListEnrolls } from 'requests/queries/enrolls';

import { AttendanceCount } from 'models/Attendance';
import { useListClassroomTeacherSchoolSubjects } from 'requests/queries/classroom-teacher-school-subjects';

type FinalAttendancesTableProps = {
  classroomId?: string;
  isMinimal?: boolean;
  linkToAttendancesReport?: boolean;
};
const FinalAttendancesTable = ({
  classroomId,
  isMinimal = false
}: FinalAttendancesTableProps): JSX.Element => {
  const { data: session } = useSession();

  const { data: enrolls } = useListEnrolls(session, {
    classroom_id: classroomId
  });

  const { data: classroomTeacherSchoolSubjects } =
    useListClassroomTeacherSchoolSubjects(
      session,
      {
        employee_id: session?.user.employeeId,
        classroom_id: classroomId,
        is_multidisciplinary: null
      },
      { enabled: session?.accessLevel?.code === 'teacher' }
    );

  const attendancesFilter = useMemo(() => {
    const defaultFilter = { classroom_id: classroomId };
    if (session?.accessLevel?.code !== 'teacher') defaultFilter;

    const schoolSubjects = classroomTeacherSchoolSubjects?.map(
      ({ school_subject_id }) => school_subject_id
    );

    return { ...defaultFilter, school_subject_id: schoolSubjects };
  }, [classroomId, classroomTeacherSchoolSubjects, session]);

  const { data: attendances } = useCountAttendances(session, attendancesFilter);

  const mappedAttendances = useMemo(() => {
    if (!enrolls) return [];
    if (!attendances) return [];

    const groupedAttedances = attendances.reduce<
      Record<string, AttendanceCount>
    >((acc, item) => {
      const { enroll_id } = item;

      return {
        ...acc,
        [enroll_id]: item
      };
    }, {});

    return enrolls.items.map((enroll) => {
      const attendances = groupedAttedances[enroll.id];

      return { enroll, attendances };
    });
  }, [enrolls, attendances]);

  return (
    <Table
      items={mappedAttendances}
      keyExtractor={(item) => item.enroll.id}
      minimal={isMinimal}
      columnDivider={isMinimal}
    >
      <TableColumn label="Nome do aluno" tableKey="enroll.student.name" />

      <TableColumn label="Total de faltas" tableKey="attendances.absences" />
      <TableColumn
        label="Alerta de faltas em porcentagem"
        tableKey="attendances.absences_percent"
        render={(value) => (value ? `${value}%` : '-')}
      />
      <TableColumn
        label="Resultado com relação as faltas"
        tableKey="attendances.absences_percent"
        render={(value) => (value > 25 ? 'Reprovado' : 'Aprovado')}
      />
    </Table>
  );
};

export default FinalAttendancesTable;
