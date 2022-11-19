import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ChevronLeft } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import { AttendancesTable } from 'components/AttendancesTable';
import Tab from 'components/Tab';
import EditClassForm from 'components/EditClassForm';
import Button from 'components/Button';

import { useShowClass } from 'requests/queries/class';

import * as S from './styles';

const EditClassTemplate = () => {
  const { query, back } = useRouter();

  const { data: session } = useSession();
  const { data: classEntity } = useShowClass(session, query.class_id as string);

  const tabItems = useMemo(() => {
    return [
      {
        title: 'Frequência',
        element: <AttendancesTable class={classEntity} enableWithDone />
      }
    ];
  }, [classEntity]);

  return (
    <Base>
      <Heading>Editar aula</Heading>
      <S.BackButtonContainer>
        <Button
          styleType="outlined"
          size="medium"
          onClick={back}
          icon={<ChevronLeft size={20} />}
        >
          Voltar
        </Button>
      </S.BackButtonContainer>

      <S.Wrapper>
        {classEntity && <EditClassForm classEntity={classEntity} />}
      </S.Wrapper>

      <Tab items={tabItems} />
    </Base>
  );
};

export default EditClassTemplate;
