import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Card from 'components/Card';

import { useEnrollCount } from 'requests/queries/enrolls';
import { useCountSchools } from 'requests/queries/schools';
import { useGradesCount } from 'requests/queries/grades';
import { useEmployeesCount } from 'requests/queries/employee';
import { useSchoolYearWithSchoolTerms } from 'requests/queries/school-year';
import { useCountSchoolSubjects } from 'requests/queries/school-subjects';

import * as S from './styles';

const MunicipalSecretaryDashboard = () => {
  const { data: session } = useSession();

  const { data: schoolYear } = useSchoolYearWithSchoolTerms(session, {
    id: session?.configs.school_year_id
  });
  const { data: enrollCount } = useEnrollCount(session, {});
  const { data: schoolsCount } = useCountSchools(session);
  const { data: gradesCount } = useGradesCount(session, {
    school_year_id: session?.configs.school_year_id
  });
  const { data: employeesCount } = useEmployeesCount(session);
  const { data: schoolSubjectsCount } = useCountSchoolSubjects(session, {
    school_year_id: session?.configs.school_year_id
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
          description="Secretaria Municipal"
          link="/auth/administration/municipal-secretary"
          module="MUNICIPAL_SECRETARY"
        />

        <Card
          description="Matrículas ativas"
          link="/auth/enrolls"
          module="ENROLL"
        >
          {enrollCount?.count}
        </Card>

        <Card
          description="Servidores"
          link="/auth/administration/employees"
          module="EMPLOYEE"
        >
          {employeesCount?.count}
        </Card>

        <Card
          description="Escolas"
          link="/auth/administration/schools"
          module="SCHOOL"
        >
          {schoolsCount?.count}
        </Card>

        <Card
          description="Séries"
          link="/auth/administration/grades"
          module="GRADE"
        >
          {gradesCount?.count}
        </Card>

        <Card
          description="Disciplinas"
          link="/auth/administration/school-subjects"
          module="SCHOOL-SUBJECT"
        >
          {schoolSubjectsCount?.count}
        </Card>

        <Card description="Períodos e Horários" link="/auth/class-periods" />

        <Card
          description="Lotação de professores"
          link="/auth/administration/school-teachers"
          module="SCHOOL_TEACHER"
        />

        <Card description="Ata" link="/auth/reports/ata" />
        <Card
          description="Livro de registros"
          link="/auth/reports/registers-book"
        />
        <Card
          description="Quadro de notas"
          link="/auth/reports/school-report-board"
        />
        <Card
          description="Total geral de faltas"
          link="/auth/reports/total-attendances"
        />
        <Card description="Aulas registradas" link="/auth/classes" />
        <Card description="Relatório de aulas" link={`/auth/class-reports`} />
        <Card
          description="Calendário Escolar"
          link={`/auth/calendar`}
          module="CALENDAR"
          rule="READ"
        />
      </S.Wrapper>
    </Base>
  );
};

export default MunicipalSecretaryDashboard;
