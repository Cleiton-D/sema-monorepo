import { memo } from 'react';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import { FormattedClassPeriod } from 'models/ClassPeriod';

type ClassPeriodsTableProps = {
  classPeriods: FormattedClassPeriod[];
};

const ClassPeriodsTable = ({ classPeriods }: ClassPeriodsTableProps) => {
  return (
    <Table<FormattedClassPeriod>
      items={classPeriods}
      keyExtractor={(value) => value.id}
    >
      <TableColumn label="Descrição" tableKey="translated_description" />
      <TableColumn label="Início" tableKey="time_start" contentAlign="center" />
      <TableColumn label="Fim" tableKey="time_end" contentAlign="center" />
      <TableColumn
        label="Duração das aulas"
        tableKey="class_time"
        contentAlign="center"
      />
      <TableColumn
        label="Duração do intervalo"
        tableKey="break_time"
        contentAlign="center"
      />
      <TableColumn
        label="Horário do intervalo"
        tableKey="break_time_start"
        contentAlign="center"
      />
    </Table>
  );
};

export default memo(ClassPeriodsTable);
