import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import TimetablesTeachersTable from 'components/TimetablesTeachersTable';
import Paginator from 'components/Paginator';

import { Classroom } from 'models/Classroom';

import {
  ListClassroomsFilters,
  useListClassrooms
} from 'requests/queries/classrooms';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import * as S from './styles';

const INITIAL_FILTERS = {
  page: 1,
  size: 20
};
const Timetables = () => {
  const [filters, setFilters] =
    useState<ListClassroomsFilters>(INITIAL_FILTERS);

  const { query } = useRouter();
  const { data: session } = useSession();

  const schoolId = useMemo(() => {
    if (query.school_id === 'me') {
      return session?.schoolId as string;
    }
    return query.school_id as string;
  }, [query, session]);

  const classroomsFilters = useMemo(() => {
    return {
      school_id: schoolId,
      with_in_multigrades: false,
      with_multigrades: true,
      school_year_id: session?.configs.school_year_id,
      ...filters
    };
  }, [filters, schoolId, session]);

  const { data: classrooms } = useListClassrooms(session, classroomsFilters);

  return (
    <Base>
      <Heading>Horário das aulas</Heading>
      <S.TableSection>
        <S.SectionTitle>
          <h4>Turmas</h4>
        </S.SectionTitle>
        <Table<Classroom>
          items={classrooms?.items || []}
          keyExtractor={(value) => value.id}
        >
          <TableColumn label="Descrição" tableKey="description">
            {(classroom: Classroom) => (
              <TimetablesTeachersTable classroom={classroom} />
            )}
          </TableColumn>
          <TableColumn
            label="Série"
            tableKey="grade"
            actionColumn
            render={(classroom: Classroom) =>
              classroom.is_multigrade ? 'Seriado' : classroom.grade?.description
            }
          />
          <TableColumn
            label="Período"
            tableKey="class_period.description"
            render={(class_period) => translateDescription(class_period)}
          />
          {/* <TableColumn
            label="Matriculas ativas"
            tableKey="enroll_count"
            contentAlign="center"
          /> */}
        </Table>
        <S.PaginatorContainer>
          <Paginator
            total={classrooms?.total || 0}
            currentPage={classrooms?.page || 1}
            currentSize={classrooms?.size || 20}
            onChangeSize={(size: number) =>
              setFilters((current) => ({ ...current, size }))
            }
            onChangePage={(page: number) =>
              setFilters((current) => ({ ...current, page }))
            }
          />
        </S.PaginatorContainer>
      </S.TableSection>
    </Base>
  );
};

export default Timetables;
