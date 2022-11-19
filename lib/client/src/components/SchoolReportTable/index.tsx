import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';

import { MappedSchoolReportSubject } from 'models/SchoolReport';

import { useListSchoolReports } from 'requests/queries/school-reports';
import { useCountAttendances } from 'requests/queries/attendances';
import { useGetEnrollDetails } from 'requests/queries/enrolls';
import { useListSchoolsSubjects } from 'requests/queries/school-subjects';

import { schoolReportsSubjectsMapper } from 'utils/mappers/schoolReportsMapper';
import { masks } from 'utils/masks';

import * as S from './styles';

type SchoolReportTableProps = {
  enrollId?: string;
  isMininal?: boolean;
};

const SchoolReportTable = ({
  enrollId,
  isMininal = false
}: SchoolReportTableProps) => {
  const { data: session } = useSession();

  const { data: enroll } = useGetEnrollDetails(enrollId, session);
  const { data: schoolReports = [] } = useListSchoolReports(session, {
    enroll_id: enrollId
  });

  const { data: attendances } = useCountAttendances(session, {
    class_id: 'all',
    enroll_id: enrollId,
    split_by_school_term: true,
    split_by_school_subject: true
  });

  const { data: schoolSubjects = [] } = useListSchoolsSubjects(
    session,
    {
      grade_id: enroll?.grade_id,
      include_multidisciplinary: true
    },
    { enabled: !!enroll?.grade_id }
  );

  const mappedSchoolReports = useMemo(
    () =>
      schoolReports
        ? schoolReportsSubjectsMapper(
            schoolReports,
            attendances,
            schoolSubjects
          )
        : [],
    [schoolReports, attendances, schoolSubjects]
  );

  return (
    <S.Wrapper>
      <Table<MappedSchoolReportSubject>
        items={mappedSchoolReports}
        keyExtractor={(item) => item.school_subject}
        minimal={isMininal}
      >
        <TableColumn label="Disciplina" tableKey="school_subject" />
        <TableColumn
          label="Notas 1° Bi."
          tableKey="FIRST"
          contentAlign="center"
          render={(value) => masks['school-report'](`${value}`) || '-'}
        />
        <TableColumn
          label="Faltas 1° Bi."
          tableKey="attendances-FIRST"
          contentAlign="center"
          render={(value) => value || 0}
        />
        <TableColumn
          label="Notas 2° Bi."
          tableKey="SECOND"
          contentAlign="center"
          render={(value) => masks['school-report'](`${value} `) || '-'}
        />
        <TableColumn
          label="Faltas 2° Bi."
          tableKey="attendances-SECOND"
          contentAlign="center"
          render={(value) => value || 0}
        />
        <TableColumn
          label="Nota Rec 1° Sem."
          tableKey="FIRST-REC"
          contentAlign="center"
          render={(value) => masks['school-report'](`${value} `) || '-'}
        />
        <TableColumn
          label="Notas 3° Bi."
          tableKey="THIRD"
          contentAlign="center"
          render={(value) => masks['school-report'](`${value}`) || '-'}
        />
        <TableColumn
          label="Faltas 3° Bi."
          tableKey="attendances-THIRD"
          contentAlign="center"
          render={(value) => value || 0}
        />
        <TableColumn
          label="Notas 4° Bi."
          tableKey="FOURTH"
          contentAlign="center"
          render={(value) => masks['school-report'](`${value}`) || '-'}
        />
        <TableColumn
          label="Faltas 4° Bi."
          tableKey="attendances-FOURTH"
          contentAlign="center"
          render={(value) => value || 0}
        />
        <TableColumn
          label="Nota Rec 2° Sem."
          tableKey="SECOND-REC"
          contentAlign="center"
          render={(value) => masks['school-report'](`${value} `) || '-'}
        />
        <TableColumn
          label="Nota Exame"
          tableKey="EXAM"
          contentAlign="center"
          render={(value) => masks['school-report'](`${value} `) || '-'}
        />
        <TableColumn
          label="Média Final"
          tableKey="finalAverage"
          contentAlign="center"
          render={(value) => masks['school-report'](`${value} `) || '-'}
        />
        <TableColumn
          label="Média Anual"
          tableKey="annualAverage"
          contentAlign="center"
          render={(value) => masks['school-report'](`${value} `) || '-'}
        />
      </Table>
    </S.Wrapper>
  );
};

export default SchoolReportTable;
