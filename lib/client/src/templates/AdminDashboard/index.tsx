import Base from 'templates/Base';

import Card from 'components/Card';
import DatabaseDumpCard from 'components/DatabaseDumpCard';

import { useCountSchools } from 'requests/queries/schools';
import { useGradesCount } from 'requests/queries/grades';
import { useEmployeesCount } from 'requests/queries/employee';
import { useCountSchoolSubjects } from 'requests/queries/school-subjects';
import { useCountUsers } from 'requests/queries/users';
import { useSessionSchoolYear } from 'requests/queries/session';

import * as S from './styles';

const AdminDashboard = () => {
  const { data: schoolYear } = useSessionSchoolYear();
  const { data: schoolsCount } = useCountSchools();
  const { data: gradesCount } = useGradesCount({
    school_year_id: schoolYear?.id
  });
  const { data: employeesCount } = useEmployeesCount();
  const { data: schoolSubjectsCount } = useCountSchoolSubjects({
    school_year_id: schoolYear?.id
  });
  const { data: usersCount } = useCountUsers();

  return (
    <Base>
      <S.Wrapper>
        <Card
          description="Secretaria Municipal"
          link="/auth/administration/municipal-secretary"
          module="MUNICIPAL_SECRETARY"
          rule="READ"
        />

        <Card
          description="Níveis de acesso"
          link="/auth/administration/access-levels"
          module="ACCESS_LEVEL"
          rule="READ"
        />

        <Card
          description="Usuários"
          link="/auth/users"
          module="USER"
          rule="READ"
        >
          {usersCount?.count}
        </Card>
        <Card
          description="Servidores"
          link="/auth/administration/employees"
          module="EMPLOYEE"
          rule="READ"
        >
          {employeesCount?.count}
        </Card>

        <Card
          description="Ano Letivo"
          link="/auth/administration/school-year"
          module="SCHOOL_YEAR"
          rule="READ"
        >
          {schoolYear?.reference_year || 'não definido'}
        </Card>

        <Card
          description="Escolas"
          link="/auth/administration/schools"
          module="SCHOOL"
          rule="READ"
        >
          {schoolsCount?.count}
        </Card>

        <Card
          description="Séries"
          link="/auth/administration/grades"
          module="GRADE"
          rule="READ"
        >
          {gradesCount?.count}
        </Card>

        <Card
          description="Disciplinas"
          link="/auth/administration/school-subjects"
          module="SCHOOL-SUBJECT"
          rule="READ"
        >
          {schoolSubjectsCount?.count}
        </Card>

        <Card description="Aulas registradas" link="/auth/classes" />

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

        <Card
          description="Calendário Escolar"
          link={`/auth/calendar`}
          module="CALENDAR"
          rule="READ"
        />

        <Card description="Relatório de aulas" link={`/auth/class-reports`} />

        <DatabaseDumpCard />
        <Card description="Planos de fundo" link="/auth/system/backgrounds" />
      </S.Wrapper>
    </Base>
  );
};

export default AdminDashboard;
