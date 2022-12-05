import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import format from 'date-fns/format';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import Checkbox from 'components/Checkbox';

import { Classroom } from 'models/Classroom';
import { SchoolTermPeriod } from 'models/SchoolTermPeriod';

import {
  useListAttendancesByClasses,
  ListAttendancesByClassesFilters
} from 'requests/queries/attendances';
import { useListEnrollClassrooms } from 'requests/queries/enroll-classrooms';

import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';
import { getEnrollsWithAttendances } from 'utils/mappers/attendances';

import * as S from './styles';

type AttendancesReportTableProps = {
  schoolSubjectId?: string;
  classroom: Classroom;
  schoolTermPeriod: SchoolTermPeriod;
};

const AttendancesReportTable = ({
  schoolSubjectId,
  classroom,
  schoolTermPeriod
}: AttendancesReportTableProps) => {
  const { data: session } = useSession();

  const { data: enrollClassrooms } = useListEnrollClassrooms(session, {
    classroom_id: classroom.id
  });

  const enabledListAttendances = useMemo(() => {
    if (!classroom) return false;
    if (!schoolSubjectId) {
      return false;
    }

    return true;
  }, [classroom, schoolSubjectId]);

  const listAttendancesFilters = useMemo(() => {
    return {
      classroom_id: classroom?.id,
      school_subject_id: schoolSubjectId,
      school_term: schoolTermPeriod?.school_term,
      sortBy: 'class_date',
      order: 'ASC'
    } as ListAttendancesByClassesFilters;
  }, [classroom, schoolTermPeriod?.school_term, schoolSubjectId]);

  const { data: { classes, attendances } = {} } = useListAttendancesByClasses(
    session,
    listAttendancesFilters,
    { enabled: enabledListAttendances }
  );

  const sortedClasses = useMemo(() => {
    if (!classes?.length) return [];

    return classes
      .map((item) => ({
        ...item,
        date: format(parseDateWithoutTimezone(item.class_date), 'dd/MM')
      }))
      .sort((a, b) => {
        const parsedA = parseDateWithoutTimezone(a.class_date);
        const parsedB = parseDateWithoutTimezone(b.class_date);

        return parsedA.getTime() - parsedB.getTime();
      });
  }, [classes]);

  const enrollsWithAttendances = useMemo(
    () => getEnrollsWithAttendances(enrollClassrooms, attendances),
    [attendances, enrollClassrooms]
  );

  if (!classes?.length) return null;

  return (
    <S.TableSection>
      <Table
        items={enrollsWithAttendances}
        keyExtractor={(value) => value.enroll.id}
      >
        {[
          <TableColumn
            key="name"
            label="Nome"
            tableKey="enroll.student.name"
            border="right"
            fixed
            render={(value) => <S.StudentName>{value}</S.StudentName>}
          />,
          ...sortedClasses.map((item) => (
            <TableColumn
              key={item.id}
              label={item.date}
              tableKey={`attendances.${item.id}`}
              contentAlign="center"
              render={(value) => {
                if (typeof value === 'undefined') return null;

                return <Checkbox isChecked={value} disabled />;
              }}
            />
          ))
        ]}
      </Table>
    </S.TableSection>
  );
};

export default AttendancesReportTable;
