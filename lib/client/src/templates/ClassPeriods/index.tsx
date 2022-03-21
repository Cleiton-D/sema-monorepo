import { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { PlusCircle } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import ClassPeriodsTable from 'components/ClassPeriodsTable';
import Button from 'components/Button';
import CreateClassPeriodModal, {
  ClassPeriodModalRef
} from 'components/CreateClassPeriodModal';

import { useListClassPeriods } from 'requests/queries/class-periods';

import * as S from './styles';

const ClassPeriods = () => {
  const { data: session } = useSession();

  const modalRef = useRef<ClassPeriodModalRef>(null);

  const { data } = useListClassPeriods(session);

  return (
    <Base>
      <Heading>Períodos e Horários</Heading>
      <S.AddButtonContainer>
        <Button
          size="medium"
          icon={<PlusCircle />}
          onClick={() => modalRef.current?.openModal()}
        >
          Adicionar período
        </Button>
      </S.AddButtonContainer>
      <S.TableSection>
        <S.SectionTitle>
          <h4>Períodos</h4>
        </S.SectionTitle>
        <ClassPeriodsTable classPeriods={data || []} />
      </S.TableSection>
      <CreateClassPeriodModal ref={modalRef} />
    </Base>
  );
};

export default ClassPeriods;
