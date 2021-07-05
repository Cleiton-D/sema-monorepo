import { useSession } from 'next-auth/client';

import Base from 'templates/Base';

import Card from 'components/Card';
import DatabaseDumpCard from 'components/DatabaseDumpCard';

import { useSchoolYearWithSchoolTerms } from 'requests/queries/school-year';
import { useCountSchools } from 'requests/queries/schools';
import { useGradesCount } from 'requests/queries/grades';
import { useEmployeesCount } from 'requests/queries/employee';
import { useCountSchoolSubjects } from 'requests/queries/school-subjects';
import { useCountUsers } from 'requests/queries/users';

import * as S from './styles';

const AdminDashboard = () => {
  const [session] = useSession();

  const { data: schoolYear } = useSchoolYearWithSchoolTerms(session, {
    id: session?.configs.school_year_id
  });
  const { data: schoolsCount } = useCountSchools(session);
  const { data: gradesCount } = useGradesCount(session);
  const { data: employeesCount } = useEmployeesCount(session);
  const { data: schoolSubjectsCount } = useCountSchoolSubjects(session);
  const { data: usersCount } = useCountUsers(session);

  return (
    <Base>
      <S.Wrapper>
        <Card
          description="Secretaria Municipal"
          link="/administration/municipal-secretary"
          module="MUNICIPAL_SECRETARY"
          rule="READ"
        />

        {/* Gambeta aqui para dar espaçamento */}
        <Card
          description="Níveis de acesso&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          link="/administration/access-levels"
          module="ACCESS_LEVEL"
          rule="READ"
        />

        <Card description="Usuários" link="/users" module="USER" rule="READ">
          {usersCount?.count}
        </Card>

        <Card
          description="Servidores"
          link="/administration/employees"
          module="EMPLOYEE"
          rule="READ"
        >
          {employeesCount?.count}
        </Card>

        <Card
          description={`${schoolYear?.reference_year || 'não definido'}`}
          link="/administration/school-year"
          module="SCHOOL_YEAR"
          rule="READ"
        >
          Ano Letivo
        </Card>

        <Card
          description="Escolas"
          link="/administration/schools"
          module="SCHOOL"
          rule="READ"
        >
          {schoolsCount?.count}
        </Card>

        <Card
          description="Séries"
          link="/administration/grades"
          module="GRADE"
          rule="READ"
        >
          {gradesCount?.count}
        </Card>

        <Card
          description="Disciplinas"
          link="/administration/school-subjects"
          module="SCHOOL-SUBJECT"
          rule="READ"
        >
          {schoolSubjectsCount?.count}
        </Card>

        <DatabaseDumpCard />
      </S.Wrapper>
    </Base>
  );
};

export default AdminDashboard;
