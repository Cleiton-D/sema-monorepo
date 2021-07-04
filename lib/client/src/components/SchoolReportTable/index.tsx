import { useSession } from 'next-auth/client';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';

import { MappedSchoolReportSubject } from 'models/SchoolReport';

import { useListSchoolReports } from 'requests/queries/school-reports';
import { schoolReportsSubjectsMapper } from 'utils/mappers/schoolReportsMapper';
import { useMemo } from 'react';

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
      />
      <TableColumn
        label="Notas 2° Bi."
        tableKey="SECOND"
        contentAlign="center"
      />
      <TableColumn
        label="Notas 3° Bi."
        tableKey="THIRD"
        contentAlign="center"
      />
      <TableColumn
        label="Notas 4° Bi."
        tableKey="FOURTH"
        contentAlign="center"
      />
    </Table>
  );
};

export default SchoolReportTable;
