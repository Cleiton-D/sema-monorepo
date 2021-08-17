import { useSession } from 'next-auth/client';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';

import { MappedSchoolReportSubject } from 'models/SchoolReport';

import { useListSchoolReports } from 'requests/queries/school-reports';
import { schoolReportsSubjectsMapper } from 'utils/mappers/schoolReportsMapper';
import { useMemo } from 'react';
import { masks } from 'utils/masks';

type SchoolReportTableProps = {
  enrollId?: string;
  isMininal?: boolean;
};

const SchoolReportTable = ({
  enrollId,
  isMininal = false
}: SchoolReportTableProps) => {
  const [session] = useSession();
  const { data: schoolReports } = useListSchoolReports(session, {
    enroll_id: enrollId
  });

  const mappedSchoolReports = useMemo(
    () => (schoolReports ? schoolReportsSubjectsMapper(schoolReports) : []),
    [schoolReports]
  );

  return (
    <Table<MappedSchoolReportSubject>
      items={mappedSchoolReports}
      keyExtractor={(item) => item.school_subject}
      minimal={isMininal}
    >
      <TableColumn label="Matéria" tableKey="school_subject" />
      <TableColumn
        label="Notas 1° Bi."
        tableKey="FIRST"
        contentAlign="center"
        render={(value) => masks['school-report'](`${value}`) || '-'}
      />
      <TableColumn
        label="Notas 2° Bi."
        tableKey="SECOND"
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
        label="Notas 4° Bi."
        tableKey="FOURTH"
        contentAlign="center"
        render={(value) => masks['school-report'](`${value}`) || '-'}
      />
    </Table>
  );
};

export default SchoolReportTable;
