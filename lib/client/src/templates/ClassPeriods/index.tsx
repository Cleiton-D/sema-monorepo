import { useSession } from 'next-auth/client';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import ClassPeriodsTable from 'components/ClassPeriodsTable';

import { useListClassPeriods } from 'requests/queries/class-periods';

import * as S from './styles';

const ClassPeriods = () => {
  const [session] = useSession();

  const { data } = useListClassPeriods(session);

  return (
    <Base>
      <Heading>Períodos e Horários</Heading>
      <S.TableSection>
        <S.SectionTitle>
          <h4>Períodos</h4>
        </S.SectionTitle>
        <ClassPeriodsTable classPeriods={data || []} />
      </S.TableSection>
    </Base>
  );
};

export default ClassPeriods;
