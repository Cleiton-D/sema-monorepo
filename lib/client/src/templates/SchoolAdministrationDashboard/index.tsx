import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Card from 'components/Card';

import { useSchoolYearWithSchoolTerms } from 'requests/queries/school-year';
import { useEnrollCount } from 'requests/queries/enrolls';
import { useCountClassrooms } from 'requests/queries/classrooms';
import { useGetSchool } from 'requests/queries/schools';

import * as S from './styles';

const SchoolAdministrationDashboard = () => {
  const { data: session } = useSession();

  const { data: school } = useGetSchool(session, { id: 'me' });

  const { data: schoolYear } = useSchoolYearWithSchoolTerms(session, {
    id: session?.configs.school_year_id
  });
  const { data: enrollCount } = useEnrollCount(session, {
    school_id: school?.id
  });
  const { data: classroomsCount } = useCountClassrooms(session, {
    school_id: school?.id
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
      </S.Wrapper>
    </Base>
  );
};

export default SchoolAdministrationDashboard;
