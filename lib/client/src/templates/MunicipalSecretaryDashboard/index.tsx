import { useSession } from 'next-auth/client';

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
  const [session] = useSession();

  const { data: schoolYear } = useSchoolYearWithSchoolTerms(session, {
    id: session?.configs.school_year_id
  });
  const { data: enrollCount } = useEnrollCount(session, {});
  const { data: schoolsCount } = useCountSchools(session);
  const { data: gradesCount } = useGradesCount(session);
  const { data: employeesCount } = useEmployeesCount(session);
  const { data: schoolSubjectsCount } = useCountSchoolSubjects(session);

  return (
    <Base>
      <S.Wrapper>
        <Card
          description={`${schoolYear?.reference_year}`}
          link="/administration/school-year"
          module="SCHOOL_YEAR"
        >
          Ano Letivo
        </Card>

        <Card
          description="Secretaria Municipal"
          link="/administration/municipal-secretary"
          module="MUNICIPAL_SECRETARY"
        />

        <Card description="Alunos ativos" link="/enrolls" module="ENROLL">
          {enrollCount?.count}
        </Card>

        <Card
          description="Servidores"
          link="/administration/employees"
          module="EMPLOYEE"
        >
          {employeesCount?.count}
        </Card>

        <Card
          description="Escolas"
          link="/administration/schools"
          module="SCHOOL"
        >
          {schoolsCount?.count}
        </Card>

        <Card description="Séries" link="/administration/grades" module="GRADE">
          {gradesCount?.count}
        </Card>

        <Card
          description="Disciplinas"
          link="/administration/school-subjects"
          module="SCHOOL-SUBJECT"
        >
          {schoolSubjectsCount?.count}
        </Card>

        <Card
          description="Lotação de professores"
          link="/administration/school-teachers"
          module="SCHOOL_TEACHER"
        />

        <Card description="Períodos e Horários&nbsp;" link="/class-periods" />
      </S.Wrapper>
    </Base>
  );
};

export default MunicipalSecretaryDashboard;
