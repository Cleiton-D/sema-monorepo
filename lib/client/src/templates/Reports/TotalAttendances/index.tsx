import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import ClassroomsSearch from 'components/ClassroomsSearch';
import ClassroomsTable from 'components/ClassroomsTable';
import FinalAttendancesTable from 'components/FinalAttendancesTable';
import Paginator from 'components/Paginator';

import { Classroom } from 'models/Classroom';

import {
  ListClassroomsFilters,
  useListClassrooms
} from 'requests/queries/classrooms';

import * as S from './styles';

const INITIAL_FILTERS = {
  page: 1,
  size: 20
};
const TotalAttendancesTemplate = (): JSX.Element => {
  const [filters, setFilters] =
    useState<ListClassroomsFilters>(INITIAL_FILTERS);

  const { data: session } = useSession();
  const handleSearch = (searchData: ListClassroomsFilters) => {
    setFilters({ ...INITIAL_FILTERS, ...searchData });
  };

  const searchFilters = useMemo(() => {
    const school_id = session?.schoolId || filters.school_id;
    const resultFilters = {
      ...filters,
      school_id,
      school_year_id: session?.configs.school_year_id
    };
    if (session?.accessLevel?.code === 'teacher') {
      return { ...resultFilters, employee_id: session.user.employeeId };
    }

    return resultFilters;
  }, [filters, session]);

  const { data: classrooms } = useListClassrooms(session, searchFilters);

  const renderSubTable = ({ id }: Classroom) => (
    <FinalAttendancesTable classroomId={id} isMinimal linkToAttendancesReport />
  );

  return (
    <Base>
      <Heading>Total geral de faltas</Heading>

      <ClassroomsSearch handleSearch={handleSearch} />

      <S.TableSection>
        <ClassroomsTable
          classrooms={classrooms?.items || []}
          link={{
            name: 'Relatório de faltas',
            createHref: (classroom) => ({
              pathname: '/auth/reports/total-attendances/[classroom_id]',
              query: {
                classroom_id: classroom.id
              }
            })
          }}
          subTable={
            session?.accessLevel?.code === 'teacher'
              ? undefined
              : renderSubTable
          }
        />
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

export default TotalAttendancesTemplate;
