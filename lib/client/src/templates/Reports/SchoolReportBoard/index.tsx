import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import EnrollsReportTable from 'components/EnrollsReportTable';
import SchoolReportTable from 'components/SchoolReportTable';
import SearchEnrolls from 'components/SearchEnrolls';
import Paginator from 'components/Paginator';

import { Enroll } from 'models/Enroll';

import { EnrollFilters, useListEnrolls } from 'requests/queries/enrolls';

import * as S from './styles';

const INITIAL_FILTERS = {
  page: 1,
  size: 20
};
const SchoolReportBoardTemplate = (): JSX.Element => {
  const [filters, setFilters] = useState<EnrollFilters>(INITIAL_FILTERS);

  const { data: session } = useSession();

  const handleSearch = (searchData: EnrollFilters) => {
    setFilters({ ...INITIAL_FILTERS, ...searchData });
  };

  const enrollsFilters = useMemo(() => {
    return {
      ...filters,
      school_id: session?.schoolId || filters.school_id
    };
  }, [session, filters]);
  const { data: enrolls } = useListEnrolls(session, enrollsFilters);

  return (
    <Base>
      <Heading>Quadro de notas</Heading>

      <SearchEnrolls handleSearch={handleSearch} />

      <S.TableSection>
        <EnrollsReportTable
          enrolls={enrolls?.items || []}
          subTable={({ id }: Enroll) => (
            <SchoolReportTable enrollId={id} isMininal />
          )}
        />
        <S.PaginatorContainer>
          <Paginator
            total={enrolls?.total || 0}
            currentPage={enrolls?.page || 1}
            currentSize={enrolls?.size || 20}
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

export default SchoolReportBoardTemplate;
