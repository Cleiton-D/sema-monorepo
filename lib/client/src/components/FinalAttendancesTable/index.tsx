import { useMemo } from 'react';
import { useSession } from 'next-auth/react';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';

import { useListAttendances } from 'requests/queries/attendances';

import { groupAttendandesByEnroll } from 'utils/mappers/attendances';

type FinalAttendancesTableProps = {
  classroomId?: string;
  isMinimal?: boolean;
};
const FinalAttendancesTable = ({
  classroomId,
  isMinimal = false
}: FinalAttendancesTableProps): JSX.Element => {
  const { data: session } = useSession();

  const { data: attendances } = useListAttendances(session, {
    classroom_id: classroomId
  });

  const mappedAttendances = useMemo(() => {
    if (!attendances) return [];

    return groupAttendandesByEnroll(attendances);
  }, [attendances]);

  return (
    <Table
      items={mappedAttendances}
      keyExtractor={(item) => item.enroll.id}
      minimal={isMinimal}
      columnDivider={isMinimal}
    >
      <TableColumn label="Nome do aluno" tableKey="enroll.student.name" />

      <TableColumn label="Total de faltas" tableKey="totalAbsences" />
      <TableColumn
        label="Alerta de faltas em porcentagem"
        tableKey="absencesPercent"
        render={(value) => `${value}%`}
      />
      <TableColumn
        label="Resultado com relação as faltas"
        tableKey="absencesPercent"
        render={(value) => (value > 25 ? 'Reprovado' : 'Aprovado')}
      />
    </Table>
  );
};

export default FinalAttendancesTable;
