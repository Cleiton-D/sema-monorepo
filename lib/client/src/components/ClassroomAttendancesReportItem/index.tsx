import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Printer } from '@styled-icons/feather';

import { SchoolTermPeriod } from 'models/SchoolTermPeriod';

import UnregisteredSelect from 'components/UnregisteredSelect';
import AttendancesReportTable from 'components/AttendancesReportTable';

import { useShowClassroom } from 'requests/queries/classrooms';
import { useShowGrade } from 'requests/queries/grades';
import { useProfile, useUser } from 'requests/queries/session';

import { useListSchoolSubjects } from './hooks';
import * as S from './styles';

type ClassroomAttendancesReportItemProps = {
  schoolTermPeriod: SchoolTermPeriod;
};
const ClassroomAttendancesReportItem = ({
  schoolTermPeriod
}: ClassroomAttendancesReportItemProps) => {
  const [selectedSchoolSubject, setSelectedSchoolSubject] = useState<string>();
  // const [page, setPage] = useState(1);
  // const [size, setSize] = useState(20);

  const { query } = useRouter();

  const { data: profile } = useProfile();
  const { data: user } = useUser();

  const { data: classroom } = useShowClassroom(
    {
      id: query.classroom_id as string
    },
    { enabled: !!query.classroom_id }
  );

  const { data: grade } = useShowGrade(classroom?.grade_id);
  const { data: schoolSubjects } = useListSchoolSubjects({
    isTeacher: profile?.access_level?.code === 'teacher',
    accessLevel: profile?.access_level?.code,
    userEmployeeId: user?.employee?.id,
    grade_id: classroom?.grade_id,
    is_multidisciplinary: grade?.is_multidisciplinary
  });

  const schoolSubjectOptions = useMemo(() => {
    if (!schoolSubjects?.length) return [];

    return schoolSubjects.map((schoolSubject) => ({
      label: schoolSubject.description,
      value: schoolSubject.id
    }));
  }, [schoolSubjects]);

  return (
    (<S.Wrapper>
      <S.Header>
        <UnregisteredSelect
          label="Disciplina"
          name="school_subject_id"
          options={schoolSubjectOptions}
          css={{ width: 300 }}
          onChange={setSelectedSchoolSubject}
          selectedOption={selectedSchoolSubject}
        />

        <Link
          href={{
            pathname: '/auth/exports/attendances',
            query: {
              classroom_id: classroom?.id,
              school_subject_id: selectedSchoolSubject,
              school_term_period_id: schoolTermPeriod?.id
            }
          }}
          passHref
          legacyBehavior>
          <S.LightLink target="_blank">
            <Printer
              size={20}
              style={{ strokeWidth: 2, marginRight: '0.5rem' }}
            />
            Imprimir
          </S.LightLink>
        </Link>
      </S.Header>
      {classroom && (
        <AttendancesReportTable
          schoolSubjectId={selectedSchoolSubject}
          classroom={classroom}
          schoolTermPeriod={schoolTermPeriod}
        />
      )}
    </S.Wrapper>)
  );
};

export default ClassroomAttendancesReportItem;
