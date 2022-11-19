import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import ClassroomSchoolReportTable from 'components/ClassroomSchoolReportTable';
import Tab from 'components/Tab';

import { useShowClassroom } from 'requests/queries/classrooms';
import { useListClassroomTeacherSchoolSubjects } from 'requests/queries/classroom-teacher-school-subjects';

import * as S from './styles';

const ClassroomSchoolReport = (): JSX.Element => {
  const { query } = useRouter();
  const { data: session } = useSession();

  const { data: classroom } = useShowClassroom(session, {
    id: query.classroom_id as string
  });

  const { data: classroomSchoolSubjects } =
    useListClassroomTeacherSchoolSubjects(session, {
      classroom_id: query.classroom_id as string,
      employee_id: session?.user.employeeId,
      is_multidisciplinary: 0
    });

  const tabItems = useMemo(() => {
    if (!classroomSchoolSubjects) return [];

    return classroomSchoolSubjects.map(({ school_subject, classroom, id }) => ({
      title: school_subject.description,
      element: (
        <ClassroomSchoolReportTable
          key={id}
          classroom={classroom}
          schoolSubject={school_subject}
        />
      )
    }));
  }, [classroomSchoolSubjects]);

  return (
    <Base>
      <Heading>Notas - {classroom?.description}</Heading>
      <S.LightText>{classroom?.school?.name}</S.LightText>
      <S.Content>
        <Tab items={tabItems} />
      </S.Content>
    </Base>
  );
};

export default ClassroomSchoolReport;
