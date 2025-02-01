import { useMemo } from 'react';
import Link from 'next/link';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';

import { Classroom } from 'models/Classroom';

import { useListMultigradeClassrooms } from 'requests/queries/multigrade-classrooms';
import { useProfile } from 'requests/queries/session';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import * as S from './styles';

type ClassroomsTableProps = {
  multigradeId: string;
};

export const MultigradeClassroomsTable = ({
  multigradeId
}: ClassroomsTableProps) => {
  const { data: profile } = useProfile();

  const { data: multigradeClassrooms = [] } = useListMultigradeClassrooms({
    multigrade_id: multigradeId
  });

  const classrooms = useMemo(
    () => multigradeClassrooms.map(({ classroom }) => classroom),
    [multigradeClassrooms]
  );

  return (
    (<Table items={classrooms} keyExtractor={(value) => value.id} minimal>
      <TableColumn tableKey="description" label="Turma" />
      {!profile?.school?.id && (
        <TableColumn label="Escola" tableKey="school.name" />
      )}
      <TableColumn label="Série" tableKey="grade.description" />
      <TableColumn
        label="Período"
        tableKey="class_period.description"
        render={(class_period) => translateDescription(class_period)}
      />
      <TableColumn label="Matrículas ativas" tableKey="enroll_count" />
      <TableColumn
        label="Links"
        tableKey=""
        contentAlign="center"
        actionColumn
        render={(classroom: Classroom) => (
          <Link
            href={{
              pathname: '/auth/school/[school_id]/classrooms/[classroom_id]',
              query: {
                school_id: classroom.school_id,
                classroom_id: classroom.id
              }
            }}
            passHref
            legacyBehavior>
            <S.TableLink>Ver turma</S.TableLink>
          </Link>
        )}
      />
    </Table>)
  );
};

export default MultigradeClassroomsTable;
