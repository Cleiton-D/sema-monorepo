import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import EnrollsReportTable from 'components/EnrollsReportTable';
import SchoolReportTable from 'components/SchoolReportTable';
import SearchEnrolls from 'components/SearchEnrolls';

import { Enroll } from 'models/Enroll';

import { EnrollFilters, useListEnrolls } from 'requests/queries/enrolls';

import * as S from './styles';

const SchoolReportBoardTemplate = (): JSX.Element => {
  const [filters, setFilters] = useState<EnrollFilters>({});

  const { data: session } = useSession();

  const enrollsFilters = useMemo(() => {
    return {
      ...filters,
      school_id: session?.schoolId || filters.school_id
    };
  }, [session, filters]);
  const { data: enrolls = [] } = useListEnrolls(session, enrollsFilters);

  return (
    <Base>
      <Heading>Quadro de notas</Heading>

      <SearchEnrolls handleSearch={setFilters} />

      <S.TableSection>
        <EnrollsReportTable
          enrolls={enrolls}
          subTable={({ id }: Enroll) => (
            <SchoolReportTable enrollId={id} isMininal />
          )}
        />
      </S.TableSection>
    </Base>
  );
};

export default SchoolReportBoardTemplate;
