import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';

import { MappedSchoolReportSubject } from 'models/SchoolReport';

import { useListSchoolReports } from 'requests/queries/school-reports';
import { useListAttendances } from 'requests/queries/attendances';

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
  const { data: schoolReports = [] } = useListSchoolReports(session, {
    enroll_id: enrollId
  });
  const { data: attendances } = useListAttendances(session, {
    class_id: 'all',
    enroll_id: enrollId
  });

  const mappedSchoolReports = useMemo(
    () =>
      schoolReports
        ? schoolReportsSubjectsMapper(schoolReports, attendances)
        : [],
    [schoolReports, attendances]
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
          tableKey="first"
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
          tableKey="second"
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
          tableKey="first_rec"
          contentAlign="center"
          render={(value) => masks['school-report'](`${value} `) || '-'}
        />
        <TableColumn
          label="Notas 3° Bi."
          tableKey="third"
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
          tableKey="fourth"
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
          tableKey="second_rec"
          contentAlign="center"
          render={(value) => masks['school-report'](`${value} `) || '-'}
        />
        <TableColumn
          label="Nota Exame"
          tableKey="exam"
          contentAlign="center"
          render={(value) => masks['school-report'](`${value} `) || '-'}
        />
      </Table>
    </S.Wrapper>
  );
};

export default SchoolReportTable;
