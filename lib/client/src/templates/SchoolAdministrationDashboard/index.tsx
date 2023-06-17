import Base from 'templates/Base';

import Card from 'components/Card';

import { useEnrollCount } from 'requests/queries/enrolls';
import { useCountClassrooms } from 'requests/queries/classrooms';
import { useProfile, useSessionSchoolYear } from 'requests/queries/session';

import * as S from './styles';

const SchoolAdministrationDashboard = () => {
  const { data: profile } = useProfile();
  const { data: schoolYear } = useSessionSchoolYear();

  const { data: enrollCount } = useEnrollCount({
    school_id: profile?.school?.id,
    school_year_id: schoolYear?.id
  });
  const { data: classroomsCount } = useCountClassrooms({
    school_id: profile?.school?.id,
    school_year_id: schoolYear?.id
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
          description="Matrículas ativas"
          link={`/auth/enrolls`}
          module="ENROLL"
        >
          {enrollCount?.count}
        </Card>

        <Card
          description="Turmas"
          link={`/auth/school/me/classrooms`}
          module="CLASSROOM"
        >
          {classroomsCount?.count}
        </Card>

        {/* <Card
          description="Professores"
          link={`/auth/school/${school.id}/teacher-school-subjects`}
          module="TEACHER_SCHOOL_SUBJECT"
        >
          {schoolTeachersCount?.count}
        </Card> */}

        <Card
          description="Turmas x Professores"
          link={`/auth/school/me/classroom-teacher`}
          module="CLASSROOM_TEACHER"
        />

        <Card description="Aulas registradas" link="/auth/classes" />
        <Card description="Horários" link="/auth/school/me/timetables" />

        <Card description="Ata" link="/auth/reports/ata" />
        <Card description="Relatório de aulas" link={`/auth/class-reports`} />
        <Card description="Relatório Final" link={`/auth/final-reports`} />

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

export default SchoolAdministrationDashboard;
