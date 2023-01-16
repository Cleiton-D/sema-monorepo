import { useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import ClassroomsSearch from 'components/ClassroomsSearch';
import ClassroomsTable from 'components/ClassroomsTable';
import FinalAtaTable from 'components/FinalAtaTable';
import Paginator from 'components/Paginator';

import {
  ListClassroomsFilters,
  useListClassrooms
} from 'requests/queries/classrooms';

import * as S from './styles';

const INITIAL_FILTERS = {
  page: 1,
  size: 20
};
const AtaTemplate = (): JSX.Element => {
  const [filters, setFilters] =
    useState<ListClassroomsFilters>(INITIAL_FILTERS);

  const { data: session } = useSession();

  const handleSearch = useCallback((searchData: ListClassroomsFilters) => {
    setFilters({ ...INITIAL_FILTERS, ...searchData });
  }, []);

  const searchFilters = useMemo(() => {
    return {
      school_id: session?.schoolId as string,
      school_year_id: session?.configs.school_year_id,
      ...filters
    };
  }, [session, filters]);

  const { data: classrooms } = useListClassrooms(session, searchFilters);

  return (
    <Base>
      <Heading>Ata</Heading>

      <ClassroomsSearch handleSearch={handleSearch} />

      <S.TableSection>
        <ClassroomsTable
          classrooms={classrooms?.items || []}
          subTable={(classroom) => <FinalAtaTable classroom={classroom} />}
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

export default AtaTemplate;
