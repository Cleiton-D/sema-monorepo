import { useState } from 'react';
import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import ClassroomsSearch from 'components/ClassroomsSearch';
import ClassroomsTable from 'components/ClassroomsTable';
import RegistersBookTable from 'components/RegistersBookTable';
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
const RegistersBookTemplate = (): JSX.Element => {
  const [filters, setFilters] = useState<ListClassroomsFilters>({});

  const handleSearch = (searchData: ListClassroomsFilters) => {
    setFilters({ ...INITIAL_FILTERS, ...searchData });
  };

  const { data: session } = useSession();
  const { data: classrooms } = useListClassrooms(session, {
    ...filters,
    school_year_id: session?.configs.school_year_id
  });

  return (
    <Base>
      <Heading>Livro de registros</Heading>

      <ClassroomsSearch handleSearch={handleSearch} />

      <S.TableSection>
        <ClassroomsTable
          classrooms={classrooms?.items || []}
          subTable={(classroom) => <RegistersBookTable classroom={classroom} />}
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

export default RegistersBookTemplate;
