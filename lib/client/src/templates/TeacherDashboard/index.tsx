import { useRef } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { CardChecklist } from '@styled-icons/bootstrap';

import Base from 'templates/Base';

import Card from 'components/Card';
import SelectTeacherClassroomModal, {
  SelectTeacherClassroomModalRef
} from 'components/SelectTeacherClassroomModal';

import { useSchoolYearWithSchoolTerms } from 'requests/queries/school-year';
import { useCountClasses } from 'requests/queries/class';
import { useGetSchool } from 'requests/queries/schools';

import * as S from './styles';

type HandleNavSchoolReportsProps = {
  classroomId: string;
  schoolSubjectId: string;
};

const TeacherDashboard = () => {
  const modalRef = useRef<SelectTeacherClassroomModalRef>(null);

  const router = useRouter();

  const { data: session } = useSession();

  const { data: school } = useGetSchool(session, { id: 'me' });

  const { data: schoolYear } = useSchoolYearWithSchoolTerms(session, {
    id: session?.configs.school_year_id
  });
  const { data: classesCount } = useCountClasses(session, {
    employee_id: session?.user.employeeId,
    school_id: session?.schoolId
  });

  const handleClick = ({
    classroomId,
    schoolSubjectId
  }: HandleNavSchoolReportsProps) => {
    router.push(
      `/auth/school/${school?.id}/classrooms/${classroomId}/school-reports?school_subject=${schoolSubjectId}`
    );
  };

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
          // onClick={() => modalRef.current?.openModal()}
        />
      </S.Wrapper>
      <SelectTeacherClassroomModal ref={modalRef} onSubmit={handleClick} />
    </Base>
  );
};

export default TeacherDashboard;
