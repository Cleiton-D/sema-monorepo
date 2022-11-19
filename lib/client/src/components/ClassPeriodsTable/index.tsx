import { memo, useRef } from 'react';
import { Edit } from '@styled-icons/feather';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import CreateClassPeriodModal, {
  ClassPeriodModalRef
} from 'components/CreateClassPeriodModal';

import { FormattedClassPeriod } from 'models/ClassPeriod';

import * as S from './styles';

type ClassPeriodsTableProps = {
  classPeriods: FormattedClassPeriod[];
};

const ClassPeriodsTable = ({ classPeriods }: ClassPeriodsTableProps) => {
  const modalRef = useRef<ClassPeriodModalRef>(null);

  return (
    <>
      <Table<FormattedClassPeriod>
        items={classPeriods}
        keyExtractor={(value) => value.id}
      >
        <TableColumn label="Descrição" tableKey="translated_description" />
        <TableColumn
          label="Início"
          tableKey="time_start"
          contentAlign="center"
        />
        <TableColumn label="Fim" tableKey="time_end" contentAlign="center" />
        <TableColumn
          label="Duração da hora-aula"
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
        <TableColumn
          label="Ações"
          tableKey=""
          contentAlign="center"
          actionColumn
          render={(classPeriod: FormattedClassPeriod) => (
            <S.ActionButton
              type="button"
              title="Editar período"
              onClick={() =>
                modalRef.current?.openModal(classPeriod.originalClassPeriod)
              }
            >
              <Edit size={20} color="#0393BE" title="Editar aluno" />
            </S.ActionButton>
          )}
        />
      </Table>
      <CreateClassPeriodModal ref={modalRef} />
    </>
  );
};

export default memo(ClassPeriodsTable);
