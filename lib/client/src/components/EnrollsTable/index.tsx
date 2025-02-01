import { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import differenceInYears from 'date-fns/differenceInYears';
import { Repeat, Edit } from '@styled-icons/feather';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import SchoolReportTable from 'components/SchoolReportTable';
import MoveEnrollModal, {
  MoveEnrollModalRef
} from 'components/MoveEnrollModal';

import { Enroll } from 'models/Enroll';

import { useProfile } from 'requests/queries/session';

import { translateStatus } from 'utils/translateStatus';
import { translateDescription } from 'utils/mappers/classPeriodMapper';
import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

import * as S from './styles';

type EnrollsTableProps = {
  minimal?: boolean;
  enrolls?: Enroll[];
  showActions?: boolean;
};
const EnrollsTable = ({
  minimal = false,
  showActions = false,
  enrolls
}: EnrollsTableProps): JSX.Element => {
  const router = useRouter();

  const { data: profile } = useProfile();

  const moveEnrollModalRef = useRef<MoveEnrollModalRef>(null);

  return (<>
    <Table<Enroll>
      items={enrolls || []}
      keyExtractor={(value) => value.id}
      minimal={minimal}
    >
      {!minimal ? (
        <TableColumn label="Nome" tableKey="student.name">
          {({ id }: Enroll) => <SchoolReportTable enrollId={id} isMininal />}
        </TableColumn>
      ) : (
        <TableColumn label="Nome" tableKey="student.name" />
      )}

      <TableColumn
        label="Idade"
        tableKey="student.birth_date"
        render={function (birth_date: string) {
          const parsedBirthDate = parseDateWithoutTimezone(birth_date);

          return <>{differenceInYears(new Date(), parsedBirthDate)}</>;
        }}
      />

      <TableColumn label="NIS" tableKey="student.nis" />
      <TableColumn label="Código único" tableKey="student.unique_code" />

      {!profile?.school?.id && (
        <TableColumn label="Escola" tableKey="school.name" />
      )}

      <TableColumn label="Série" tableKey="grade.description" />
      <TableColumn
        label="Período"
        tableKey="class_period.description"
        render={translateDescription}
      />
      <TableColumn label="Turma" tableKey="current_classroom.description" />
      <TableColumn
        label="Situação"
        tableKey="status"
        contentAlign="center"
        render={(status) => translateStatus(status)}
      />
      <TableColumn
        label="Links"
        tableKey=""
        contentAlign="center"
        actionColumn
        module="ENROLL"
        render={(enroll: Enroll) => (
          <Link href={`/auth/student/${enroll.id}`} passHref legacyBehavior>
            <S.TableLink>Ver aluno</S.TableLink>
          </Link>
        )}
      />

      {showActions && (
        <TableColumn
          label="Ações"
          tableKey=""
          contentAlign="center"
          actionColumn
          module="ENROLL"
          rule="WRITE"
          render={(enroll: Enroll) => (
            <S.ActionButtons>
              <S.ActionButton
                type="button"
                title="Movimentar estudante"
                onClick={() => moveEnrollModalRef.current?.openModal(enroll)}
              >
                <Repeat
                  size={20}
                  color="#0393BE"
                  title="Movimentar estudante"
                />
              </S.ActionButton>
              <S.ActionButton
                type="button"
                title="Editar aluno"
                onClick={() => router.push(`/auth/student/${enroll.id}/edit`)}
              >
                <Edit size={20} color="#0393BE" title="Editar aluno" />
              </S.ActionButton>
            </S.ActionButtons>
          )}
        />
      )}
    </Table>
    <MoveEnrollModal ref={moveEnrollModalRef} />
  </>);
};

export default EnrollsTable;
