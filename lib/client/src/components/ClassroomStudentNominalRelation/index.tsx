import { useMemo } from 'react';

import Table from 'components/Table';

import { useListEnrolls } from 'requests/queries/enrolls';
import TableColumn from 'components/TableColumn';
import { enrollMapper } from 'utils/mappers/enrollMapper';

type ClassroomStudentNominalRelationProps = {
  classroomId?: string;
};

const ClassroomStudentNominalRelation = ({
  classroomId
}: ClassroomStudentNominalRelationProps) => {
  const { data: enrolls } = useListEnrolls({
    classroom_id: classroomId
  });

  const mappedEnrolls = useMemo(() => {
    if (!enrolls) return [];

    return enrolls.items.map(enrollMapper);
  }, [enrolls]);

  return (
    <Table items={mappedEnrolls} keyExtractor={(value) => value.id} minimal>
      <TableColumn label="Nome do aluno" tableKey="student.name" />
      <TableColumn label="Sexo" tableKey="formattedGender" />
      <TableColumn label="Nascimento" tableKey="formattedBirthDate" />
      <TableColumn label="Idade" tableKey="studentAge" />
      <TableColumn label="Situação" tableKey="formattedStatus" />
    </Table>
  );
};

export default ClassroomStudentNominalRelation;
