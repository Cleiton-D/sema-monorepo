import { useState } from 'react';
import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import ClassroomsSearch from 'components/ClassroomsSearch';
import ClassroomsTable from 'components/ClassroomsTable';
import FinalAttendancesTable from 'components/FinalAttendancesTable';

import { Classroom } from 'models/Classroom';

import {
  ListClassroomsFilters,
  useListClassrooms
} from 'requests/queries/classrooms';

import * as S from './styles';

const TotalAttendancesTemplate = (): JSX.Element => {
  const [filters, setFilters] = useState<ListClassroomsFilters>({});

  const { data: session } = useSession();
  const { data: classrooms = [] } = useListClassrooms(session, filters);

  return (
    <Base>
      <Heading>Total geral de faltas</Heading>

      <ClassroomsSearch handleSearch={setFilters} />

      <S.TableSection>
        <ClassroomsTable
          classrooms={classrooms}
          subTable={({ id }: Classroom) => (
            <FinalAttendancesTable classroomId={id} isMinimal />
          )}
        />
      </S.TableSection>
    </Base>
  );
};

export default TotalAttendancesTemplate;
