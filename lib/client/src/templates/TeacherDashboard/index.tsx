import { useSession } from 'next-auth/react';
import { CardChecklist } from '@styled-icons/bootstrap';

import Base from 'templates/Base';

import Card from 'components/Card';

import { useSchoolYearWithSchoolTerms } from 'requests/queries/school-year';
import { useCountClasses } from 'requests/queries/class';

import * as S from './styles';

const TeacherDashboard = () => {
  const { data: session } = useSession();

  const { data: schoolYear } = useSchoolYearWithSchoolTerms(session, {
    id: session?.configs.school_year_id
  });
  const { data: classesCount } = useCountClasses(session, {
    employee_id: session?.user.employeeId,
    school_id: session?.schoolId
  });

  return (
    <Base>
      <S.Wrapper>
        <Card
          description={`${schoolYear?.reference_year || 'não definido'}`}
          link="/auth/administration/school-year"
          module="SCHOOL_YEAR"
        >
          Ano Letivo
        </Card>

        <Card
          description={`${classesCount?.count}`}
          link="/auth/classes"
          module="CLASS"
        >
          Aulas registradas
        </Card>

        <Card
          description="Notas"
          module="SCHOOL_REPORT"
          icon={<CardChecklist />}
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
