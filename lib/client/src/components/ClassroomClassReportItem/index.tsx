import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Printer } from '@styled-icons/feather';
import format from 'date-fns/format';

import { SchoolTermPeriod } from 'models/SchoolTermPeriod';

import UnregisteredSelect from 'components/UnregisteredSelect';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import Paginator from 'components/Paginator';

import { useShowClassroom } from 'requests/queries/classrooms';
import { useListClasses, ListClassesFilters } from 'requests/queries/class';
import { useShowGrade } from 'requests/queries/grades';
import { useListSchoolSubjects } from 'requests/queries/custom-school-subjects';
import { useProfile, useUser } from 'requests/queries/session';

import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

import * as S from './styles';

type ClassroomClassReportItemProps = {
  schoolTermPeriod?: SchoolTermPeriod;
};
const ClassroomClassReportItem = ({
  schoolTermPeriod
}: ClassroomClassReportItemProps) => {
  const [selectedSchoolSubject, setSelectedSchoolSubject] = useState<string>();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const { data: profile } = useProfile();
  const { data: user } = useUser();

  const { query } = useRouter();

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

  const enabledListClasses = useMemo(() => {
    if (!classroom) return false;
    if (!selectedSchoolSubject) {
      return false;
    }

    return true;
  }, [classroom, selectedSchoolSubject]);

  const listClassesFilters = useMemo(() => {
    return {
      classroom_id: classroom?.id,
      school_subject_id: selectedSchoolSubject,
      school_term: schoolTermPeriod?.school_term,
      page,
      size,
      sortBy: 'class_date',
      order: 'ASC'
    } as ListClassesFilters;
  }, [
    classroom,
    page,
    schoolTermPeriod?.school_term,
    selectedSchoolSubject,
    size
  ]);

  const { data: classes } = useListClasses(listClassesFilters, {
    enabled: enabledListClasses
  });

  const schoolSubjectOptions = useMemo(() => {
    if (!schoolSubjects?.length) return [];

    return schoolSubjects.map((schoolSubject) => ({
      label: schoolSubject.description,
      value: schoolSubject.id
    }));
  }, [schoolSubjects]);

  return (
    <S.Wrapper>
      <S.Header>
        <UnregisteredSelect
          label="Disciplina"
          name="school_subject_id"
          options={schoolSubjectOptions}
          css={{ width: 300 }}
          onChange={(value) => {
            setPage(1);
            setSize(20);
            setSelectedSchoolSubject(value);
          }}
          selectedOption={selectedSchoolSubject}
        />

        <Link
          href={{
            pathname: '/auth/exports/classes',
            query: {
              classroom_id: classroom?.id,
              school_subject_id: selectedSchoolSubject,
              school_term_period_id: schoolTermPeriod?.id
            }
          }}
          passHref
        >
          <S.LightLink target="_blank">
            <Printer
              size={20}
              style={{ strokeWidth: 2, marginRight: '0.5rem' }}
            />
            Imprimir
          </S.LightLink>
        </Link>
      </S.Header>

      {classes?.items && (
        <S.TableSection>
          <Table
            items={classes?.items || []}
            keyExtractor={(classEntity) => classEntity.id}
          >
            <TableColumn
              label="Dia"
              tableKey="class_date"
              render={(value) =>
                format(parseDateWithoutTimezone(value), 'dd/MM')
              }
            />
            <TableColumn label="Conteúdo" tableKey="taught_content" />
          </Table>
          <S.PaginatorContainer>
            <Paginator
              total={classes?.total || 0}
              currentPage={classes?.page || 1}
              currentSize={classes?.size || 20}
              onChangeSize={(size: number) => {
                setPage(1);
                setSize(size);
              }}
              onChangePage={setPage}
            />
          </S.PaginatorContainer>
        </S.TableSection>
      )}
    </S.Wrapper>
  );
};

export default ClassroomClassReportItem;
