import { useSession } from 'next-auth/client';

import Base from 'templates/Base';

import Card from 'components/Card';

import { School } from 'models/School';

import { useSchoolYearWithSchoolTerms } from 'requests/queries/school-year';
import { useEnrollCount } from 'requests/queries/enrolls';
import { useCountClassrooms } from 'requests/queries/classrooms';
import { useCountSchoolTeachers } from 'requests/queries/school-teachers';

import * as S from './styles';

export type SchoolAdministrationDashboardProps = {
  school: School;
};
const SchoolAdministrationDashboard = ({
  school
}: SchoolAdministrationDashboardProps) => {
  const [session] = useSession();

  const { data: schoolYear } = useSchoolYearWithSchoolTerms(session, {
    id: session?.configs.school_year_id
  });
  const { data: enrollCount } = useEnrollCount(session, {
    school_id: school.id
  });
  const { data: classroomsCount } = useCountClassrooms(session, {
    school_id: school.id
  });
  const { data: schoolTeachersCount } = useCountSchoolTeachers(session, {
    school_id: school.id
  });

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
          description="Alunos ativos"
          link={`/enrolls?school_id=${school.id}`}
          module="ENROLL"
        >
          {enrollCount?.count}
        </Card>

        <Card
          description="Turmas"
          link={`/school/${school.id}/classrooms`}
          module="CLASSROOM"
        >
          {classroomsCount?.count}
        </Card>

        <Card
          description="Professores"
          link={`/school/${school.id}/teacher-school-subjects`}
          module="TEACHER_SCHOOL_SUBJECT"
        >
          {schoolTeachersCount?.count}
        </Card>

        <Card
          description="Turmas x Professores"
          link={`/school/${school.id}/classroom-teacher`}
          module="CLASSROOM_TEACHER"
        />
      </S.Wrapper>
    </Base>
  );
};

export default SchoolAdministrationDashboard;
