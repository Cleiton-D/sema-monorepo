import { useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { parseISO, differenceInYears } from 'date-fns';
import { Repeat } from '@styled-icons/feather';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import SchoolReportTable from 'components/SchoolReportTable';
import MoveEnrollModal, {
  MoveEnrollModalRef
} from 'components/MoveEnrollModal';

import { Enroll } from 'models/Enroll';

import { translateStatus } from 'utils/translateStatus';
import { translateDescription } from 'utils/mappers/classPeriodMapper';

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
  const { data: session } = useSession();

  const moveEnrollModalRef = useRef<MoveEnrollModalRef>(null);

  return (
    <>
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
            const parsedBirthDate = parseISO(birth_date);

            return <>{differenceInYears(new Date(), parsedBirthDate)}</>;
          }}
        />

        <TableColumn label="NIS" tableKey="student.nis" />
        <TableColumn label="Código único" tableKey="student.unique_code" />

        {!session?.schoolId && (
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
            <Link href={`/auth/student/${enroll.id}`} passHref>
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
            )}
          />
        )}
      </Table>
      <MoveEnrollModal ref={moveEnrollModalRef} />
    </>
  );
};

export default EnrollsTable;
