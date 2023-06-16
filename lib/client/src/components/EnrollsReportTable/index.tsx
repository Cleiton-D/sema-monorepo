import Link from 'next/link';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';

import { Enroll } from 'models/Enroll';

import { useProfile } from 'requests/queries/session';

import { translateStatus } from 'utils/translateStatus';
import { translateDescription } from 'utils/mappers/classPeriodMapper';

import * as S from './styles';

type EnrollsReportTableProps = {
  enrolls: Enroll[];
  subTable?: (enroll: Enroll) => JSX.Element;
};

const EnrollsReportTable = ({
  enrolls,
  subTable
}: EnrollsReportTableProps): JSX.Element => {
  const { data: profile } = useProfile();

  return (
    <Table<Enroll> items={enrolls || []} keyExtractor={(value) => value.id}>
      <TableColumn label="Nome" tableKey="student.name">
        {subTable && subTable}
      </TableColumn>

      <TableColumn label="NIS" tableKey="student.nis" />

      {!profile?.school?.id && (
        <TableColumn label="Escola" tableKey="school.name" />
      )}

      <TableColumn label="Turma" tableKey="current_classroom.description" />
      <TableColumn label="Série" tableKey="grade.description" />
      <TableColumn
        label="Período"
        tableKey="class_period.description"
        render={translateDescription}
      />
      <TableColumn
        label="Situação"
        tableKey="status"
        contentAlign="center"
        render={(status) => translateStatus(status)}
      />
      <TableColumn
        label="Ações"
        tableKey=""
        contentAlign="center"
        actionColumn
        render={(enroll: Enroll) => (
          <Link href={`/auth/student/${enroll.id}`} passHref>
            <S.TableLink>Ver aluno</S.TableLink>
          </Link>
        )}
      />
    </Table>
  );
};

export default EnrollsReportTable;
