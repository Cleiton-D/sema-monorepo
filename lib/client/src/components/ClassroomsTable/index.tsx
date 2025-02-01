import Link, { LinkProps } from 'next/link';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';

import { Classroom } from 'models/Classroom';

import { useProfile } from 'requests/queries/session';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import * as S from './styles';

type ClassroomsTableProps = {
  classrooms: Classroom[];
  subTable?: (classroom: Classroom) => JSX.Element;
  link?: {
    name: string;
    createHref: (classroom: Classroom) => LinkProps['href'];
  };
  actions?: (classroom: Classroom) => JSX.Element;
};

export const ClassroomsTable = ({
  classrooms,
  subTable,
  link,
  actions
}: ClassroomsTableProps) => {
  const { data: profile } = useProfile();

  return (
    (<Table items={classrooms} keyExtractor={(value) => value.id}>
      <TableColumn tableKey="description" label="Turma">
        {subTable && subTable}
      </TableColumn>
      {!profile?.school?.id && (
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
      {!!link && (
        <TableColumn
          label="Links"
          tableKey=""
          contentAlign="center"
          actionColumn
          render={(classroom: Classroom) => (
            <Link href={link.createHref(classroom)} passHref legacyBehavior>
              <S.TableLink>{link.name}</S.TableLink>
            </Link>
          )}
        />
      )}
      {!!actions && (
        <TableColumn
          label="Ações"
          tableKey=""
          contentAlign="center"
          actionColumn
          render={actions}
        />
      )}
    </Table>)
  );
};

export default ClassroomsTable;
