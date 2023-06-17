import { useMemo } from 'react';
import { useRouter } from 'next/router';

import Base from 'templates/Base';

import { SchoolTermPeriod } from 'models/SchoolTermPeriod';

import Heading from 'components/Heading';
import Tab from 'components/Tab';
import ClassroomAttendancesReportItem from 'components/ClassroomAttendancesReportItem';

import { useListSchoolTermPeriods } from 'requests/queries/school-term-periods';
import { useShowClassroom } from 'requests/queries/classrooms';
import { useSessionSchoolYear } from 'requests/queries/session';

import {
  orderSchoolTerm,
  shortTranslateSchoolTerm
} from 'utils/mappers/schoolTermPeriodMapper';

import * as S from './styles';

const SCHOOL_TERMS = ['FIRST', 'SECOND', 'THIRD', 'FOURTH'];
const AttendancesReportTemplate = () => {
  const { query } = useRouter();

  const { data: schoolYear } = useSessionSchoolYear();

  const { data: classroom } = useShowClassroom(
    {
      id: query.classroom_id as string
    },
    { enabled: !!query.classroom_id }
  );

  const { data: schoolTermPeriods } = useListSchoolTermPeriods({
    school_year_id: schoolYear?.id
  });

  const schoolTermsMap = useMemo(() => {
    if (!schoolTermPeriods?.length) return [];

    return schoolTermPeriods
      .sort((a, b) => orderSchoolTerm(a.school_term, b.school_term))
      .reduce<Array<{ name: string; schoolTermPeriod: SchoolTermPeriod }>>(
        (acc, schoolTermPeriod) => {
          if (!SCHOOL_TERMS.includes(schoolTermPeriod.school_term)) return acc;

          return [
            ...acc,
            {
              name: shortTranslateSchoolTerm(schoolTermPeriod.school_term),
              schoolTermPeriod: schoolTermPeriod
            }
          ];
        },
        []
      );
  }, [schoolTermPeriods]);

  const tabItems = useMemo(() => {
    return schoolTermsMap.map(({ name, schoolTermPeriod }) => {
      return {
        title: name,
        element: (
          <ClassroomAttendancesReportItem schoolTermPeriod={schoolTermPeriod} />
        )
      };
    });
  }, [schoolTermsMap]);

  return (
    <Base>
      <Heading>Relatório de faltas - {classroom?.description}</Heading>
      <S.LightText>Escola: {classroom?.school?.name}</S.LightText>

      <S.Wrapper>
        <Tab items={tabItems} />
      </S.Wrapper>
    </Base>
  );
};

export default AttendancesReportTemplate;
