import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { PlusCircle } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Button from 'components/Button';
import SearchEnrolls from 'components/SearchEnrolls';
import EnrollsTable from 'components/EnrollsTable';
import Paginator from 'components/Paginator';

import { useAccess } from 'hooks/AccessProvider';

import { EnrollFilters, useListEnrolls } from 'requests/queries/enrolls';

import * as S from './styles';

const INITIAL_FILTERS = {
  page: 1,
  size: 20
};
const Enrolls = () => {
  const [filters, setFilters] = useState<EnrollFilters>(INITIAL_FILTERS);

  const { enableAccess } = useAccess();

  const { query } = useRouter();

  const { data: session } = useSession();

  const handleSearch = (searchData: EnrollFilters) => {
    setFilters({ ...INITIAL_FILTERS, ...searchData });
  };

  const schoolId = useMemo(() => {
    if (!query.school_id || query.school_id === 'me') {
      return session?.schoolId;
    }
    return query.school_id;
  }, [query, session]);

  const enrollsFilters = useMemo(() => {
    return {
      school_id: schoolId as string,
      school_year_id: session?.configs.school_year_id,
      status: 'ACTIVE',
      ...filters
    } as EnrollFilters;
  }, [schoolId, filters, session]);

  const { data: enrolls } = useListEnrolls(session, enrollsFilters);

  const canChangeEnroll = useMemo(
    () => enableAccess({ module: 'ENROLL', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <Base>
      <Heading>Matrículas</Heading>
      {canChangeEnroll && schoolId && (
        <S.AddButtonContainer>
          <Link href={`/auth/enrolls/new?school_id=${schoolId}`} passHref>
            <Button
              styleType="normal"
              size="medium"
              icon={<PlusCircle />}
              as="a"
            >
              Nova matrícula
            </Button>
          </Link>
        </S.AddButtonContainer>
      )}

      <SearchEnrolls handleSearch={handleSearch} />

      <S.TableSection>
        <S.SectionTitle>
          <h4>Matrículas</h4>
        </S.SectionTitle>
        <EnrollsTable enrolls={enrolls?.items || []} showActions />
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

export default Enrolls;
