import { useMemo } from 'react';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';

import { Classroom } from 'models/Classroom';

import { enrollMapper } from 'utils/mappers/enrollMapper';
import { useListEnrollClassrooms } from 'requests/queries/enroll-classrooms';

type RegistersBookTableProps = {
  classroom: Classroom;
};
const RegistersBookTable = ({
  classroom
}: RegistersBookTableProps): JSX.Element => {
  const { data: enrollClassrooms = [] } = useListEnrollClassrooms({
    classroom_id: classroom.id,
    status: 'ACTIVE'
  });

  const mappedEnrolls = useMemo(() => {
    return enrollClassrooms.map(({ enroll, status }) => {
      return enrollMapper({ ...enroll, status });
    });
  }, [enrollClassrooms]);

  return (
    <Table
      items={mappedEnrolls}
      keyExtractor={(item) => item.id}
      minimal
      columnDivider
    >
      <TableColumn tableKey="student.name" label="Nome do Aluno" />
      <TableColumn tableKey="formattedBirthDate" label="Data de nascimento" />
      <TableColumn tableKey="student.naturalness" label="Naturalidade" />
      <TableColumn tableKey="student.naturalness_uf" label="UF" />
      <TableColumn tableKey="student.mother_name" label="Nome da mãe" />
      <TableColumn tableKey="formattedEnrollDate" label="Data de matrícula" />
      <TableColumn tableKey="formattedStatus" label="Resultado final" />
    </Table>
  );
};

export default RegistersBookTable;
