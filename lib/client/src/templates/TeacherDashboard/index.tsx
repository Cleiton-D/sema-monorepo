import { useRef } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { CardChecklist } from '@styled-icons/bootstrap';

import Base from 'templates/Base';

import Card from 'components/Card';
import SelectTeacherClassroomModal, {
  SelectTeacherClassroomModalRef
} from 'components/SelectTeacherClassroomModal';

import { School } from 'models/School';

import { useSchoolYearWithSchoolTerms } from 'requests/queries/school-year';
import { useCountClasses } from 'requests/queries/class';

import * as S from './styles';

type HandleNavSchoolReportsProps = {
  classroomId: string;
  schoolSubjectId: string;
};

export type TeacherDashboardProps = {
  school: School;
};
const TeacherDashboard = ({ school }: TeacherDashboardProps) => {
  const modalRef = useRef<SelectTeacherClassroomModalRef>(null);

  const router = useRouter();

  const [session] = useSession();
  const { data: schoolYear } = useSchoolYearWithSchoolTerms(session, {
    id: session?.configs.school_year_id
  });
  const { data: classesCount } = useCountClasses(session, {
    employee_id: session?.user.employeeId
  });

  const handleClick = ({
    classroomId,
    schoolSubjectId
  }: HandleNavSchoolReportsProps) => {
    router.push(
      `/school/${school.id}/classrooms/${classroomId}/school-reports?school_subject=${schoolSubjectId}`
    );
  };

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
          description={`${classesCount?.count}`}
          link="/classes"
          module="CLASS"
        >
          Aulas registradas
        </Card>

        <Card
          description="Notas"
          module="SCHOOL_REPORT"
          icon={<CardChecklist />}
          iconAlign="right"
          onClick={() => modalRef.current?.openModal()}
        />
      </S.Wrapper>
      <SelectTeacherClassroomModal ref={modalRef} onSubmit={handleClick} />
    </Base>
  );
};

export default TeacherDashboard;
