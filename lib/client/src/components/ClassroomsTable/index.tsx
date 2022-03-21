import { useSession } from 'next-auth/react';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';

import { Classroom } from 'models/Classroom';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

type ClassroomsTableProps = {
  classrooms: Classroom[];
  subTable?: (classroom: Classroom) => JSX.Element;
};

export const ClassroomsTable = ({
  classrooms,
  subTable
}: ClassroomsTableProps) => {
  const { data: session } = useSession();

  return (
    <Table items={classrooms} keyExtractor={(value) => value.id}>
      <TableColumn tableKey="description" label="Turma">
        {subTable && subTable}
      </TableColumn>
      {!session?.schoolId && (
        <TableColumn label="Escola" tableKey="school.name" />
      )}

      <TableColumn
        label="Série"
        tableKey="grade"
        render={(grade) => grade.description}
      />
      <TableColumn
        label="Período"
        tableKey="class_period.description"
        render={(class_period) => translateDescription(class_period)}
      />
    </Table>
  );
};

export default ClassroomsTable;
