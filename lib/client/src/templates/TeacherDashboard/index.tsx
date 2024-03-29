import { CardChecklist } from '@styled-icons/bootstrap';

import Base from 'templates/Base';

import Card from 'components/Card';

import { useCountClasses } from 'requests/queries/class';
import {
  useProfile,
  useSessionSchoolYear,
  useUser
} from 'requests/queries/session';

import * as S from './styles';

const TeacherDashboard = () => {
  const { data: schoolYear } = useSessionSchoolYear();
  const { data: user } = useUser();
  const { data: profile } = useProfile();

  const { data: classesCount } = useCountClasses({
    employee_id: user?.employee?.id,
    school_id: profile?.school?.id,
    school_year_id: schoolYear?.id
  });

  return (
    <Base>
      <S.Wrapper>
        <Card
          description="Ano Letivo"
          link="/auth/administration/school-year"
          module="SCHOOL_YEAR"
        >
          {schoolYear?.reference_year || 'não definido'}
        </Card>

        <Card
          description="Aulas registradas"
          link="/auth/classes"
          module="CLASS"
        >
          {classesCount?.count}
        </Card>

        <Card
          description="Notas"
          module="SCHOOL_REPORT"
          icon={<CardChecklist style={{ width: '4rem', strokeWidth: 2 }} />}
          iconAlign="right"
          link="/auth/school-reports/by-classroom"
        />

        <Card
          description="Calendário Escolar"
          link={`/auth/calendar`}
          module="CALENDAR"
          rule="READ"
        />

        <Card
          description="Total geral de faltas"
          link="/auth/reports/total-attendances"
        />

        <Card description="Relatório de aulas" link={`/auth/class-reports`} />
      </S.Wrapper>
    </Base>
  );
};

export default TeacherDashboard;
