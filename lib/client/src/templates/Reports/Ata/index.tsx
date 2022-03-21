import { useState } from 'react';
import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import ClassroomsSearch from 'components/ClassroomsSearch';
import ClassroomsTable from 'components/ClassroomsTable';
import FinalAtaTable from 'components/FinalAtaTable';

import {
  ListClassroomsFilters,
  useListClassrooms
} from 'requests/queries/classrooms';

import * as S from './styles';

const AtaTemplate = (): JSX.Element => {
  const [filters, setFilters] = useState<ListClassroomsFilters>({});

  const { data: session } = useSession();
  const { data: classrooms = [] } = useListClassrooms(session, filters);

  return (
    <Base>
      <Heading>Ata</Heading>

      <ClassroomsSearch handleSearch={setFilters} />

      <S.TableSection>
        <ClassroomsTable
          classrooms={classrooms}
          subTable={(classroom) => <FinalAtaTable classroom={classroom} />}
        />
      </S.TableSection>
    </Base>
  );
};

export default AtaTemplate;
